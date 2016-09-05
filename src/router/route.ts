import {Logger} from "../logger/logger";

/**
 * Request methods
 * POST, PUT, PATCH listen for data event
 */
export enum Methods {
  GET,
  HEAD,
  DELETE,
  TRACE,
  OPTIONS,
  CONNECT,
  POST,
  PUT,
  PATCH
}

export interface Params {
  size: number;
  forEach(callback: Function): any;
}

export interface Headers {
}

export interface Route {
  parseRequest(pathName: string, method: string, headers: Headers): Promise<any>;
  createUrl(routeName: string, params: Params): Promise<any>;
}
/**
 * Route rule config
 */
export interface RouteRuleConfig {
  url: string;
  route: string;
  methods: Array<Methods>;
}

