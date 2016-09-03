import {IncomingMessage, ServerResponse} from "http";
import {Router} from "./components/router";
import {uuid} from "./core";
import {Inject, Injectable} from "./decorators";
import {Logger} from "./components/logger";

@Injectable()
export class Request {
  private id: string = uuid();
  private isCustomError: boolean = false;
  private isForwarded: boolean = false;
  private isForwarder: boolean = false;

  constructor(logger: Logger,
              router: Router,
              @Inject("request") request,
              @Inject("response") response,
              @Inject("injector") injector) {
    //logger.info("Request.args", request.url, router);
    response.end("NICE");

  }
}
