import { NextFunction, Request, Response } from "express";
import {
  APIVersion,
  HTTPMethod,
  ImplementationFunction,
  RouteOptions,
} from "../interfaces";

export default class BaseRoute {
  id: string;
  version: APIVersion;
  route: string;
  method: HTTPMethod;
  middleware: any[];
  active: boolean;
  deprecated: boolean;
  implementation?: ImplementationFunction;

  constructor(id: string, options: RouteOptions) {
    this.id = id;
    this.version = options.version;
    this.route = options.route;
    this.method = options.method;
    this.middleware = options.middleware;
    this.active = options.active;
    this.deprecated = options.deprecated;
    this.implementation = this.run;
  }

  async run(
    version: string,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    return res.sendStatus(501);
  }
}
