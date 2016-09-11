import {Route, Headers, RouteRuleConfig, ResolvedRoute} from "../interfaces/iroute";
import {RouteParser} from "./route-parser";
import {getMethod} from "./router";
import {Injectable, Inject} from "../decorators";
import {IAfterConstruct} from "../interfaces/iprovider";

/**
 * @since 1.0.0
 * @function
 * @name RouteRule
 * @constructor
 *
 * @param {RouteRuleConfig} config
 *
 * @description
 * Route rule provider is used by router to parse request and create route url
 */
@Injectable()
export class RouteRule implements Route, IAfterConstruct {

  @Inject("config")
  private config: RouteRuleConfig;
  private routeParser: RouteParser;
  /**
   * @since 1.0.0
   * @function
   * @name RouteRule#afterConstruct
   * @private
   *
   * @description
   * After construct apply config data
   */
  afterConstruct(): void {
    this.routeParser = RouteParser.parse(this.config.url);
  }
  /**
   * @since 1.0.0
   * @function
   * @name RouteRule#parseRequest
   * @param {String} path
   * @param {String} method
   * @param {Headers} headers
   * @private
   *
   * @return {Promise<ResolvedRoute>}
   * @static
   *
   * @description
   * Parse request is used internally by Router to be able to parse request
   */
  parseRequest(path: string, method: string, headers: Headers): Promise<ResolvedRoute|boolean> {
    if (!this.routeParser.isValid(path) || this.config.methods.indexOf(getMethod(method)) === -1) {
      return Promise.resolve(false);
    }
    return Promise.resolve({
      method: getMethod(method),
      params: this.routeParser.getParams(path),
      path: path,
      route: this.config.route
    });
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteRule#parseRequest
   * @param {String} routeName
   * @param {Object} params
   * @private
   *
   * @return {Promise<string|boolean>}
   * @static
   *
   * @description
   * It try's to create url
   */
  createUrl(routeName: string, params: Object): Promise<string|boolean> {
    if (this.config.route === routeName) {
      return Promise.resolve(this.routeParser.createUrl(params));
    }
    return Promise.resolve(false);
  }
}
