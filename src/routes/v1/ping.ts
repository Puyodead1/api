import { NextFunction, Request, Response } from "express";
import BaseRoute from "../BaseRoute";

export default class extends BaseRoute {
  constructor() {
    super("ping", {
      version: "v1",
      active: true,
      deprecated: false,
      method: "GET",
      middleware: [],
      route: "/ping",
    });
  }

  async run(version: string, req: Request, res: Response, next: NextFunction) {
    return res.send("Pong");
  }
}
