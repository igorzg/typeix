'use strict';
import {IncomingMessage} from 'http';
import {format} from 'url';
import {Logger} from "../logger/logger";
import {HttpError} from "../error";
import {Status} from "./status-code";
import {Readable, Writable} from "stream";
import {Socket} from "net";
import {Inject, Injectable} from "../decorators";
import {IModule} from "../interfaces/imodule";
import { Context } from "aws-lambda";
import {Injector} from "../injector/injector";
import {getModule} from "./bootstrap";
import {httpVerb} from "./http-verbs"

/**
 * @since 2.0.5
 * @interface
 *
 * @description
 * Configuration options for a serverless event
 */
export interface lambdaEvent {
  rawEvent:any;
  eventSource:string;
  method:httpVerb;
  path:string;
  body:string
  headers: any ;
  rawHeaders: string[];
  url?: string;
  statusCode?: number;
  statusMessage?: string;
  requestContext: any;
  identity?:any;
  rawContext?:any;
}


export class ServerlessRequest extends Readable implements IncomingMessage {

  httpVersion: string = "1.1";
  httpVersionMajor: number = 1;
  httpVersionMinor: number = 1;
  connection: Socket;
  complete: true;
  headers: any;
  rawHeaders: any;
  trailers: any;
  rawTrailers: any;
  method?: string;
  url?: string;
  statusCode?: number;
  statusMessage?: string;
  socket: Socket;
  body: Buffer;
  event:any;
  baseUrl:string;
  originalUrl:string;
  ctx:any;

  private logger:Logger;

  public setTimeout(msecs: number, callback: () => void): this {
    setTimeout(callback, msecs);
    return this;
  }

  constructor(modules: Array<IModule>, event:any, context:Context) {
    super();
    let rootInjector: Injector = getModule(modules).injector;
    this.ctx = context;
    this.logger = rootInjector.get(Logger);
    this.event = this.prepareEvent(event, context);
    this.headers = this.getHeaders(event);
    this.body = this.getBody(this.event, this.headers);

    if (typeof this.headers['content-length'] === 'undefined') {
      this.headers['content-length'] = Buffer.byteLength(this.body);
    }


    this.baseUrl = this.event.path.slice(0, -this.event.path.length);
    this.method = this.event.httpMethod;
    this.originalUrl = format({
        pathname: this.event.requestContext.path,
        query: this.event.queryStringParameters
      }),
    this.url = format({
        pathname: this.event.path,
        query: this.event.queryStringParameters
      })

  }

  private getHeaders(event:any):any {
    console.log(this.ctx.awsRequestId);
    if(!event.headers){
      event.headers = {};
    }
    event.headers.awsRequestId= this.ctx.awsRequestId.toLowerCase();
    return Object.keys(event.headers).reduce((headers, key) => {
      headers[key.toLowerCase()] = event.headers[key];
      return headers;
    }, []);
  }

  /**
   * @since 2.0.5
   * @function
   * @name prepareEvent
   * @param {Array<IModule>} modules The list of bootstrapped modules
   * @param {any} the event object of a lambda execution
   * @param {Context} the context of the lambda execution
   * @returns {lambdaEvent}
   *
   * @description
   * unifies Lambda event and set's defaults for event types which don't contain certain fields needed by the router
   */
  private prepareEvent(event:any, ctx: Context): lambdaEvent{
    const cleanedEvent:lambdaEvent = {
      rawEvent:event,
      rawContext:ctx,
      eventSource:"tbd", // TODO app should be able to identify event sources and inject routable information
      method:event.httpMethod || 'GET',
      path: event.path || '/',
      body: event.body || '',
      headers:this.getHeaders(event),
      rawHeaders: event.headers || {},
      requestContext: ctx,
      identity:ctx.identity || {}
    }
    return cleanedEvent;

  }

  private getBody(event:any, headers:Array<string>):Buffer {
    if(!event.body){
      this.logger.debug('event.body was empty',event);
      return Buffer.from('', 'utf8');
    }
    if (typeof event.body === 'string') {
      return Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8');
    } else if (Buffer.isBuffer(event.body)) {
      return event.body;
    } else if (typeof event.body === 'object') {
      const contentType = headers['content-type'];
      if (contentType && contentType.indexOf('application/json') === 0) {
        return Buffer.from(JSON.stringify(event.body));
      } else {
      this.logger.error('event.body was an object but content-type is not json',event);
      throw new HttpError(Status.Bad_Request, 'event.body was an object but content-type is not json');
      }
    }

    throw new Error(`Unexpected event.body type: ${typeof event.body}`);
  }

}