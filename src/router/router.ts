import {Logger} from "../logger/logger";
import {HttpError} from "../error";
import {Route, Headers, RouteRuleConfig, ResolvedRoute, TRoute} from "../interfaces/iroute";
import {isTruthy} from "../core";
import {Injector} from "../injector/injector";
import {RouteRule} from "./route-rule";
import {Injectable} from "../decorators/injectable";
import {Inject} from "../decorators/inject";
/**
 * @since 1.0.0
 * @enum
 * @name Methods
 *
 * @description
 * ControllerResolver methods
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
/**
 * @since 1.0.0
 * @function
 * @name getMethod
 * @param {string} method
 *
 * @description
 * Get method enum from method string
 * @throws TypeError
 */
export function getMethod(method: string): Methods {
  if (method === "GET") {
    return Methods.GET;
  } else if (method === "HEAD") {
    return Methods.HEAD;
  } else if (method === "DELETE") {
    return Methods.DELETE;
  } else if (method === "TRACE") {
    return Methods.TRACE;
  } else if (method === "OPTIONS") {
    return Methods.OPTIONS;
  } else if (method === "CONNECT") {
    return Methods.CONNECT;
  } else if (method === "POST") {
    return Methods.POST;
  } else if (method === "PUT") {
    return Methods.PUT;
  } else if (method === "PATCH") {
    return Methods.PATCH;
  }
  throw new TypeError(`Method ${method} is not known method by standard!`);
}
/**
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
   * Inject injector
   */
  @Inject(Injector)
  private injector: Injector;
  /**
   * Array of routes definition
   * @type {Array}
   */
  private routes: Array<Route> = [];

  /**
   * @since 1.0.0
   * @function
   * @name Router#prefixSlash
   * @param {string} value
   * @static
   * @private
   *
   * @description
   * Prefixes url with starting slash
   */
  static prefixSlash(value: string): string {
    return value.charAt(0) === "/" ? value : "/" + value;
  }

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
    rules.forEach(config => this.routes.push(this.addRule(RouteRule, config)));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Router#addRule
   * @param {Function} Class
   * @param {RouteRuleConfig} config
   *
   * @description
   * Add rule to router
   */
  addRule(Class: TRoute, config: RouteRuleConfig): Route {
    let injector = Injector.createAndResolveChild(
      this.injector,
      Class,
      [
        {provide: "config", useValue: config}
      ]
    );
    return injector.get(Class);
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
  async parseRequest(pathName: string, method: string, headers: Headers): Promise<ResolvedRoute> {
    for (let route of this.routes) {
      let result = await route.parseRequest(pathName, method, headers);
      if (isTruthy(result)) {
        this.logger.info("Router.parseRequest", result);
        return Promise.resolve(<ResolvedRoute> result);
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
   * @param {Object} params
   *
   * @description
   * Create url based on route and params
   */
  async createUrl(routeName: string, params: Object): Promise<string> {
    for (let route of this.routes) {
      let result = await <Promise<string>> route.createUrl(routeName, params);
      if (isTruthy(result)) {
        this.logger.info("Router.createUrl", result);
        return Promise.resolve(Router.prefixSlash(result));
      }
    }
    if (Object.keys(params).length > 0) {
      routeName += "?";
      Object.keys(params).forEach((k) => {
        routeName += k + "=" + encodeURIComponent(params[k]);
      });
    }
    this.logger.info("Router.createUrl", Router.prefixSlash(routeName));
    return Promise.resolve(Router.prefixSlash(routeName));
  }

}
