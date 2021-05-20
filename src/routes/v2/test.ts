import { NextFunction, Request, Response } from "express";
import BaseRoute from "../BaseRoute";

export default class extends BaseRoute {
  constructor() {
    super("test", {
      version: "v2",
      active: true,
      deprecated: false,
      method: "GET",
      middleware: [],
      route: "/test",
    });
  }

  async run(version: string, req: Request, res: Response, next: NextFunction) {
    return res.send("Hello from API V2!");
  }
}
