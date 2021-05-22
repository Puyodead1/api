import { NextFunction, Response, Request } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import APIApp from "../lib/APIApp";

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

export default class RateLimiters {
  api: APIApp;
  defaultLimiter: RateLimiterRedis;
  loginLimiter: RateLimiterRedis;
  constructor(api: APIApp) {
    this.api = api;
    this.defaultLimiter = new RateLimiterRedis({
      storeClient: api.redis,
      blockDuration: 20,
      points: 5,
      duration: 10,
      keyPrefix: "default",
    });
    this.loginLimiter = new RateLimiterRedis({
      storeClient: api.redis,
      blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day,
      points: maxWrongAttemptsByIPperDay,
      duration: 60 * 60 * 24,
      keyPrefix: "login_fail_ip_per_day",
    });
  }

  defaultLimiterMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    this.defaultLimiter
      .consume(req.ip)
      .then(() => {
        next();
      })
      .catch(async () => {
        const limit = await this.defaultLimiter.get(req.ip);
        res.set("X-Retry-After", String(limit?.msBeforeNext || 1));
        res.sendStatus(429);
      });
  };

  loginLimiterMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const resSlowByIP = await this.loginLimiter.get(req.ip);

    let retrySecs = 0;

    if (
      resSlowByIP &&
      resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
    ) {
      retrySecs = Math.round(resSlowByIP.msBeforeNext) || 1;
    }

    if (retrySecs > 0) {
      res.set("X-Retry-After", String(retrySecs));
      res.sendStatus(429);
    } else {
      // TODO: add logic for failed logins (https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection)
      next();
    }
  };
}
