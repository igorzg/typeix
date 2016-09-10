import {Route, Headers, Params, RouteRuleConfig} from "./route";
import {Injectable} from "../decorators";

export class RouteRule implements Route {

  constructor(config: RouteRuleConfig) {

  }

  parseRequest(pathName: string, method: string, headers: Headers): Promise<any> {
    return Promise.resolve();
  }

  createUrl(routeName: string, params: Params): Promise<any> {
    return Promise.resolve();
  }
}
