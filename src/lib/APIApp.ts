import express, { Application } from "express";
import morgan from "morgan";
import totoro from "totoro-node";
import { Route, RouteOptions } from "../interfaces";
import { join, sep, resolve } from "path";
import { promises, readdir } from "fs";
import BaseRoute from "../routes/BaseRoute";

export default class {
  public app: Application;
  config: {
    v1: { active: boolean; deprecated: boolean; endpoints: Route[] };
    v2: { active: boolean; deprecated: boolean; endpoints: Route[] };
  };

  constructor() {
    this.app = express();

    this.app.use(morgan("dev"));

    this.config = {
      v1: {
        active: true,
        deprecated: false,
        endpoints: [],
      },
      v2: {
        active: true,
        deprecated: false,
        endpoints: [],
      },
    };

    this.loadRoutes().then(() => {
      this.app.use("/api", totoro.rain(this.config));
    });
  }

  async loadRoutes() {
    for await (const f of this.getFiles(join(__dirname, "..", "routes"))) {
      if (!f.endsWith(".js") || f.includes("BaseRoute")) continue;
      try {
        this.loadRoute(f);
      } catch (err) {
        console.error(err);
      }
    }

    // this.console.log(`[Commands] Loaded ${this.commands.size} commands.`);
  }

  loadRoute(path: string) {
    console.log(path);
    try {
      const props: BaseRoute = new (require(path).default)(this);
      // {
      //   route: "/ping",
      //   method: "GET",
      //   middleware: [],
      //   active: true,
      //   deprecated: false,
      //   implementation: ping,
      // }
      this.config[props.version].endpoints.push({
        route: props.route,
        method: props.method,
        middleware: props.middleware,
        active: props.active,
        deprecated: props.deprecated,
        implementation: props.implementation,
      });
      console.log(`[Route] Loaded route ${props.id}`);
      return true;
    } catch (e) {
      throw e;
    }
  }

  async *getFiles(dir: string): AsyncGenerator<string, any, undefined> {
    const dirents = await promises.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        yield* this.getFiles(res);
      } else {
        yield res;
      }
    }
  }
}
