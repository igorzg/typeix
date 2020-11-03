import {Logger} from "../logger/logger";
import {HttpError} from "../error";
import {Route, Headers, RouteRuleConfig, IResolvedRoute, TRoute} from "../interfaces/iroute";
import {isTruthy, isString, isEqual, isPresent} from "../core";
import {Injector} from "../injector/injector";
import {RouteRule} from "./route-rule";
import {Injectable} from "../decorators/injectable";
import {Inject} from "../decorators/inject";
import {Status} from "../server/status-code";
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
 * @name getMethodName
 * @param {string} method
 *
 * @description
 * Get method name from Methods enum
 */
export function getMethodName(method: Methods): string {
  if (isEqual(Methods.GET, method)) {
    return "GET";
  } else if (isEqual(Methods.HEAD, method)) {
    return "HEAD";
  } else if (isEqual(Methods.DELETE, method)) {
    return "DELETE";
  } else if (isEqual(Methods.TRACE, method)) {
    return "TRACE";
  } else if (isEqual(Methods.OPTIONS, method)) {
    return "OPTIONS";
  } else if (isEqual(Methods.CONNECT, method)) {
    return "CONNECT";
  } else if (isEqual(Methods.POST, method)) {
    return "POST";
  } else if (isEqual(Methods.PUT, method)) {
    return "PUT";
  } else if (isEqual(Methods.PATCH, method)) {
    return "PATCH";
  }
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
   * @param {Logger} logger
   */
  @Inject(Logger)
  private logger: Logger;
  /**
   * @param {Injector} injector
   */
  @Inject(Injector)
  private injector: Injector;
  /**
   * @param {Array<Route>} routes
   */
  private routes: Array<Route> = [];
  /**
   * ErrorMessage route definition
   * @param {String} errorRoute
   */
  private errorRoutes: Array<string> = [];

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
   * @name Router#getError
   *
   * @description
   * Returns error route string
   */
  getError(module?: string): string {
    let routes = this.errorRoutes.slice();
    let item: string;
    while (routes.length > 0) {
      item = routes.pop();
      if (item.startsWith(module + "/")) {
        return item;
      }
    }
    return item;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Router#hasErrorRoute
   *
   * @description
   * Check if error route is provided
   */
  hasError(): boolean {
    return isTruthy(this.errorRoutes.length > 0);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Router#setError
   * @param {string} route
   *
   * @description
   * Add error route
   */
  setError(route: string): void {
    if (this.errorRoutes.indexOf(route) === -1 && isString(route)) {
      let list = route.split("/");
      if (list.length < 2) {
        throw new Error(`Invalid route structure: "${route}"! Valid are controller/action or module/controller/action!`);
      }
      this.errorRoutes.push(route);
    }
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
    rules.forEach(config => this.routes.push(this.createRule(RouteRule, config)));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Router#addRule
   * @param {Function} Class
   * @param {RouteRuleConfig} config
   *
   * @description
   * Create rule and add rule to list
   */
  addRule(Class: TRoute, config?: RouteRuleConfig): void {
    this.logger.info("Router.addRule", Class);
    this.routes.push(this.createRule(Class, config));
  }

  /**
   * @since 1.0.0
   * @function
   * @name Router#createRule
   * @param {Function} Class
   * @param {RouteRuleConfig} config
   *
   * @description
   * Initialize rule
   */
  private createRule(Class: TRoute, config?: RouteRuleConfig): Route {
    let injector = Injector.createAndResolveChild(
      this.injector,
      Class,
      isPresent(config) ? [{provide: "config", useValue: config}] : []
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
  async parseRequest(pathName: string, method: string, headers: Headers): Promise<IResolvedRoute> {
    for (let route of this.routes) {
      let result = await route.parseRequest(pathName, method, headers);
      if (isTruthy(result) && !isEqual(true, result)) {
        this.logger.trace("Router.parseRequest", result);
        return Promise.resolve(<IResolvedRoute> result);
      }
    }
    throw new HttpError(Status.Not_Found, `Router.parseRequest: ${pathName} no route found, method: ${method}`, {
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
      if (isTruthy(result) && !isEqual(true, result)) {
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
