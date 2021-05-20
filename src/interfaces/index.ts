import { NextFunction, Request, Response } from "express";

export type APIVersion = "v1" | "v2";
export type HTTPMethod = "GET" | "POST" | "PUT" | "HEAD" | "PATCH" | "DELETE";

export interface Route {
  route: string;
  method: HTTPMethod;
  middleware: any[];
  active: boolean;
  deprecated: boolean;
  implementation?: ImplementationFunction;
}

export interface RouteOptions {
  version: APIVersion;
  route: string;
  method: HTTPMethod;
  middleware: any[];
  active: boolean;
  deprecated: boolean;
  implementation?: ImplementationFunction;
}

export type ImplementationFunction = (
  version: string,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
