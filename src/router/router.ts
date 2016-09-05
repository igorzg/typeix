import {Logger} from "../logger/logger";
import {HttpError} from "../error";
import {Route, Headers, Params, RouteRuleConfig} from "./route";
import {Injectable, Inject} from "../decorators";
import {RouteRule} from "./route-rule";
/**
 * @license Mit Licence 2015
 * @since 1.0.0
 * @class
 * @name Router
 * @constructor
 * @description
 * Router is a component for handling routing in system.
 * All routes should be added during bootstrap process
 * @example
 * import { Bootstrap, Router } from "../core";
 * import { Assets } from "./components/assets";
 *
 * \@Bootstrap({
 *    port: 9000
 * })
 * export class Application {
 *   constructor(assets: Assets, router: Router) {
 *       router.add()
 *   }
 * }
 */
@Injectable()
export class Router {
  /**
   * Inject logger
   */
  @Inject(Logger)
  private logger: Logger;
  /**
   * Array of routes definition
   * @type {Array}
   */
  private routes: Array<Route> = [];

  /**
   * @since 1.0.0
   * @function
   * @name Router#addRules
   * @param {Array<RouteRuleConfig>} rules
   *
   * @description
   * Add route to routes list.
   * All routes must be inherited from Route interface.
   */
  addRules(rules: Array<RouteRuleConfig>): void {
    this.logger.info("Router.addRules", rules);
    rules.forEach(rule => this.routes.push(new RouteRule(rule)));
  }

  /**
   * @since 1.0.0

   * @function
   * @name Router#parseRequest
   * @param {String} pathName
   * @param {String} method
   * @param {Headers} headers
   *
   * @description
   * Parse request based on pathName and method
   */
  async parseRequest(pathName: string, method: string, headers: Headers): Promise<Route> {
    for (let route of this.routes) {
      let result = await route.parseRequest(pathName, method, headers);
      if (!!result) {
        return result;
      }
    }
    throw new HttpError(404, `Router.parseRequest: ${pathName} no route found, method: ${method}`, {
      pathName,
      method
    });
  }

  /**
   * @since 1.0.0

   * @function
   * @name Router#createUrl
   * @param {String} routeName
   * @param {Params} params
   *
   * @description
   * Create url based on route and params
   */
  async createUrl(routeName: string, params: Params): Promise<string> {
    for (let route of this.routes) {
      let result: string = await route.createUrl(routeName, params);
      if (!!result) {
        return Promise.resolve(result.charAt(0) === "/" ? result : "/" + result);
      }
    }
    if (params.size > 0) {
      routeName += "?";
      params.forEach((v, k) => {
        routeName += k + "=" + encodeURIComponent(v);
      });
    }
    return Promise.resolve(routeName.charAt(0) === "/" ? routeName : "/" + routeName);
  }
}
