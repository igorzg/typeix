import {IncomingMessage, ServerResponse} from "http";
import {Router} from "./router/router";
import {uuid} from "./core";
import {Inject, Injectable} from "./decorators";
import {Logger} from "./logger/logger";
import {Injector} from "./injector";
import {IAfterConstruct} from "./interfaces/iprovider";

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

  private id: string = uuid();
  private isCustomError: boolean = false;
  private isForwarded: boolean = false;
  private isForwarder: boolean = false;


  afterConstruct(): void {
    this.logger.info('Request.args', this.id);
    this.response.end("NICE");
  }
}
