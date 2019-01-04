'use strict';
import {IncomingMessage} from 'http';
import {format} from 'url';
import {Logger} from "../logger/logger";
import {HttpError} from "../error";
import {Status} from "./status-code";
import {Readable, Writable} from "stream";
import {Socket} from "net";
import {Inject, Injectable} from "../decorators";






export class ServerlessRequest extends Readable implements IncomingMessage {

  /**
   * @param {Logger} logger
   * @description
   * Provided by injector
   */
  @Inject(Logger)
  protected readonly logger: Logger;

  httpVersion: string = "1.1";
  httpVersionMajor: number = 1;
  httpVersionMinor: number = 1;
  connection: Socket;
  complete: true;
  headers: any;
  rawHeaders: string[];
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

  public setTimeout(msecs: number, callback: () => void): this {
    setTimeout(callback, msecs);
    return this;
  }

  constructor(event, options) {
    super();
    this.event=event;
    this.headers = this.getHeaders(event);
    this.body = this.getBody(event, this.headers);

    if (typeof this.headers['content-length'] === 'undefined') {
      this.headers['content-length'] = Buffer.byteLength(this.body);
    }

    if (typeof options.requestId === 'string' && options.requestId.length > 0) {
      const requestId = options.requestId.toLowerCase();
      this.headers[requestId] = this.headers[requestId] || event.requestContext.requestId;
    }

    this.baseUrl = event.requestContext.path.slice(0, -event.path.length);
    this.method = event.httpMethod;
    this.originalUrl = format({
        pathname: event.requestContext.path,
        query: event.queryStringParameters
      }),
    this.url = format({
        pathname: event.path,
        query: event.queryStringParameters
      })

  }

  private getHeaders(event:any):Array<string> {
    return Object.keys(event.headers).reduce((headers, key) => {
      headers[key.toLowerCase()] = event.headers[key];
      return headers;
    }, []);
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