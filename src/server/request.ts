import {isDate, isNumber, isPresent, isString, isTruthy} from "../core";
import {Inject, Injectable} from "../decorators";
import {IResolvedRoute} from "../interfaces";
import {MultiPart, MultiPartField, MultiPartFile} from "../parsers";
import {Status} from "./status-code";
import {Methods} from "../router";
import {IConnection} from "../interfaces/iconnection";
import {IncomingMessage} from "http";
import {ControllerResolver} from "./controller-resolver";

/**
 * Cookie parse regex
 * @type {RegExp}
 */
const COOKIE_PARSE_REGEX = /(\w+[^=]+)=([^;]+)/g;

export abstract class AbstractRequest {
  /**
   * @param cookies
   * @description
   * Cookies object are stored to this object first time they are parsed
   */
  private cookies: { [key: string]: string };

  /**
   * @since 1.0.0
   * @function
   * @name Request#getConnection
   *
   * @description
   * Get connection data
   */
  getConnection(): IConnection {
    const request = this.getIncomingMessage();
    return {
      uuid: this.getId(),
      method: request.method,
      url: request.url,
      httpVersion: request.httpVersion,
      httpVersionMajor: request.httpVersionMajor,
      httpVersionMinor: request.httpVersionMinor,
      remoteAddress: request.connection.remoteAddress,
      remoteFamily: request.connection.remoteFamily,
      remotePort: request.connection.remotePort,
      localAddress: request.connection.localAddress,
      localPort: request.connection.localPort
    };
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getCookies
   *
   * @description
   * Return parsed cookies
   */
  getCookies(): { [key: string]: string } {

    if (isPresent(this.cookies)) {
      return this.cookies;
    }
    // get cookie string
    let cookie: string = this.getRequestHeader("Cookie");

    if (isPresent(cookie)) {

      this.cookies = {};

      // parse cookies
      cookie.match(COOKIE_PARSE_REGEX)
        .map(item => item.split(COOKIE_PARSE_REGEX).slice(1, -1))
        .map(item => {
          return {
            key: item.shift(),
            value: item.shift()
          };
        })
        .forEach(item => {
          this.cookies[item.key] = item.value;
        });

      return this.cookies;
    }

    return {};
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getCookie
   *
   * @description
   * Return request headers
   */
  getCookie(name: string): string {
    let cookies = this.getCookies();
    return cookies[name];
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getRequestHeaders
   *
   * @description
   * Return request headers
   */
  getRequestHeaders(): any {
    return this.getIncomingMessage().headers;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getRequestHeader
   *
   * @description
   * Return request header by name
   */
  getRequestHeader(name: string): any {
    let requestHeaders = this.getRequestHeaders();
    let headers = isPresent(requestHeaders) ? requestHeaders : {};
    return headers[name.toLocaleLowerCase()];
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getParams
   *
   * @description
   * Get all request parameters
   */
  getParams(): Object {
    return isPresent(this.getResolvedRoute().params) ? this.getResolvedRoute().params : {};
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getParam
   * @param {string} name
   *
   * @description
   * Get resolve route param
   */
  getParam(name: string): string {
    let params = this.getParams();
    return params[name];
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getMethod
   *
   * @description
   * Return resolved route method
   */
  getMethod(): Methods {
    return this.getResolvedRoute().method;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getRoute
   *
   * @description
   * Return resolved route name
   */
  getRoute(): string {
    return this.getResolvedRoute().route;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getBody
   * @private
   *
   * @description
   * Get request body if present only on POST, PUT, PATCH
   */
  getBody(): Buffer {
    return Buffer.concat(this.getRawData());
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#getBodyAsMultiPart
   * @param {string} encoding
   *
   * @description
   * Get request body as multipart if present only on POST, PUT, PATCH
   */
  getBodyAsMultiPart(encoding = "utf8"): Array<MultiPartField | MultiPartFile> {
    let buffer: Buffer = this.getBody();
    let contentType = this.getRequestHeader("content-type");
    let parser = new MultiPart(contentType, encoding);
    return parser.parse(buffer);
  }

  abstract getId(): string;

  protected abstract getIncomingMessage(): IncomingMessage;

  protected abstract getResolvedRoute(): IResolvedRoute;

  protected abstract getRawData(): Array<Buffer>;
}

/**
 * @since 2.0.0
 * @class
 * @name BaseRequest
 * @constructor
 * @description
 * Provides a basic API to the original request - does only support retrieving information.
 */
@Injectable()
export class BaseRequest extends AbstractRequest {
  @Inject("request")
  private readonly incomingMessage: IncomingMessage;

  @Inject("UUID")
  private readonly id: string;

  @Inject("data")
  private readonly data: Array<Buffer>;

  @Inject("resolvedRoute")
  private readonly resolvedRoute: IResolvedRoute;

  getId(): string {
    return this.id;
  }

  protected getIncomingMessage(): IncomingMessage {
    return this.incomingMessage;
  }

  protected getResolvedRoute(): IResolvedRoute {
    return this.resolvedRoute;
  }

  protected getRawData(): Array<Buffer> {
    return this.data;
  }
}

/**
 * @since 1.0.0
 * @class
 * @name Request
 * @constructor
 * @description
 * Get request reflection to limit public api
 */
@Injectable()
export class Request extends AbstractRequest {
  /**
   * @param ControllerResolver
   * @description
   * Current internal ControllerResolver instance
   */
  @Inject("controllerResolver")
  private readonly controllerResolver: ControllerResolver;

  /**
   * @since 1.0.0
   * @function
   * @name Request#onDestroy
   *
   * @description
   * Add destroy event to public api
   */
  onDestroy(callback: (...args: any[]) => void): void {
    this.controllerResolver.getEventEmitter().once("destroy", callback);
  }

  /**
   * @since 0.0.1
   * @function
   * @name Request#setResponseCookie
   * @param {String} key cookie name
   * @param {String} value cookie value
   * @param {String|Object|Number} expires expire date
   * @param {String} path cookie path
   * @param {String} domain cookie domain
   * @param {Boolean} isHttpOnly is http only
   * @description
   * Sets an cookie header
   */
  setCookie(key: string, value: string, expires?: number | Date | string, path?: string, domain?: string, isHttpOnly?: boolean) {

    let cookie = key + "=" + value;

    if (isPresent(expires) && isNumber(expires)) {
      let date: Date = new Date();
      date.setTime(date.getTime() + (<number> expires));
      cookie += "; Expires=";
      cookie += date.toUTCString();
    } else if (isPresent(expires) && isString(expires)) {
      cookie += "; Expires=" + expires;
    } else if (isPresent(expires) && isDate(expires)) {
      cookie += "; Expires=";
      cookie += (<Date> expires).toUTCString();
    }

    if (isPresent(path)) {
      cookie += "; Path=" + path;
    }
    if (isPresent(domain)) {
      cookie += "; Domain=" + domain;
    }
    if (isTruthy(isHttpOnly)) {
      cookie += "; HttpOnly";
    }
    this.setResponseHeader("Set-cookie", cookie);

  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#setResponseHeader
   * @param {String} name
   * @param {String} value
   *
   * @description
   * Set response header
   */
  setResponseHeader(name: string, value: string | string[]): void {
    this.controllerResolver.getServerResponse().setHeader(name, value);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#setContentType
   * @param {String} value
   *
   * @description
   * Set response content type
   */
  setContentType(value: string) {
    this.controllerResolver.getEventEmitter().emit("contentType", value);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#setStatusCode
   *
   * @description
   * Set status code
   */
  setStatusCode(code: Status | number) {
    this.controllerResolver.getEventEmitter().emit("statusCode", code);
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#stopChain
   *
   * @description
   * Stops action chain
   */
  stopChain() {
    this.controllerResolver.stopChain();
  }

  /**
   * @since 1.0.0
   * @function
   * @name Request#redirectTo
   *
   * @description
   * Stops action chain
   */
  redirectTo(url: string, code: Status | number) {
    this.stopChain();
    this.controllerResolver.getEventEmitter().emit("redirectTo", {
      code, url
    });
  }

  getId(): string {
    return this.controllerResolver.getId();
  }

  protected getIncomingMessage(): IncomingMessage {
    return this.controllerResolver.getIncomingMessage();
  }

  protected getResolvedRoute(): IResolvedRoute {
    return this.controllerResolver.getResolvedRoute();
  }

  protected getRawData(): Array<Buffer> {
    return this.controllerResolver.getBody();
  }
}
