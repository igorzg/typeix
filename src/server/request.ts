import {IncomingMessage, ServerResponse} from "http";
import {Router} from "../router/router";
import {uuid} from "../core";
import {Inject, Injectable} from "../injector/decorators";
import {Logger} from "../logger/logger";
import {Injector} from "../injector/injector";
import {IAfterConstruct} from "../interfaces/iprovider";
import {EventEmitter} from "events";
import {parse} from "url";

@Injectable()
export class Request implements IAfterConstruct {

  @Inject("request")
  private request: IncomingMessage;

  @Inject("response")
  private response: ServerResponse;

  @Inject(Injector)
  private injector: Injector;

  @Inject(Logger)
  private logger: Logger;

  @Inject(Router)
  private router: Router;

  @Inject(EventEmitter)
  private eventEmitter: EventEmitter;

  private id: string = uuid();
  private isCustomError: boolean = false;
  private isForwarded: boolean = false;
  private isForwarder: boolean = false;
  private url;


  afterConstruct(): void {
    this.url = parse(this.request.url, true);
    this.logger.trace('Request.args', {
      id: this.id,
      url: this.url
    });
    this.response.end("NICE");
  }
}
