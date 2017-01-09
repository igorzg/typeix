import {Injector} from "../injector/injector";
import {fireRequest, createModule, BOOTSTRAP_MODULE} from "./bootstrap";
import {IModuleMetadata, IModule} from "../interfaces/imodule";
import {Metadata} from "../injector/metadata";
import {Inject} from "../decorators/inject";
import {Readable, Writable} from "stream";
import {Socket} from "net";
import {ServerResponse} from "http";

export interface IFakeServerConfig {
}
/**
 * @since 1.0.0
 * @function
 * @name fakeHttpServer
 * @param {Function} Class httpServer class
 * @param {IFakeServerConfig} config fakeHttpServer config
 * @returns {Injector}
 *
 * @description
 * Use httpServer function to httpServer an Module.
 */
export function fakeHttpServer(Class: Function, config?: IFakeServerConfig): FakeServerApi {

  let metadata: IModuleMetadata = Metadata.getComponentConfig(Class);
  // override bootstrap module
  metadata.name = BOOTSTRAP_MODULE;
  // set module config
  Metadata.setComponentConfig(Class, metadata);
  let modules: Array<IModule> = createModule(Class);
  let fakeServerInjector = Injector.createAndResolve(FakeServerApi, [
    {provide: "modules", useValue: modules}
  ]);
  return fakeServerInjector.get(FakeServerApi);
}


/**
 * @since 1.0.0
 * @class
 * @name FakeServerApi
 * @constructor
 * @description
 * Get a FakeServerApi to do serverside requests
 *
 * @private
 */
export class FakeServerApi {

  @Inject("modules")
  private modules: Array<IModule>;

  getModules(): Array<IModule> {
    return this.modules;
  }

  GET(url: string, headers?: Object) {
    let request = new FakeIncomingMessage();
    request.method = "GET";
    request.url = url;
    request.headers = headers;
    return this.request(request, new FakeServerResponse());
  }

  POST(url: string, data?: Array<string|Buffer>, headers?: Object) {

  }

  private request(request: FakeIncomingMessage, response: FakeServerResponse) {
    return fireRequest(this.getModules(), request, response);
  }
}


/**
 * @since 1.0.0
 * @class
 * @name FakeIncomingMessage
 * @constructor
 * @description
 * FakeIncomingMessage is used by FakeServerApi
 * Simulates socket api
 *
 * @private
 */
class FakeIncomingMessage extends Readable {
  httpVersion: string = "1.1";
  httpVersionMajor: number = 1;
  httpVersionMinor: number = 1;
  connection: Socket;
  headers: any;
  rawHeaders: string[];
  trailers: any;
  rawTrailers: any;
  method?: string;
  url?: string;
  statusCode?: number;
  statusMessage?: string;
  socket: Socket;

  setTimeout(msecs: number, callback: Function): NodeJS.Timer {
    return null;
  };

  destroy(error?: Error) {
  };
}


/**
 * @since 1.0.0
 * @class
 * @name FakeServerResponse
 * @constructor
 * @description
 * FakeServerResponse is used by FakeServerApi
 * Simulates socket api
 *
 * @private
 */
class FakeServerResponse extends Writable implements ServerResponse {

  // Extended base methods

  statusCode: number;
  statusMessage: string;
  headersSent: boolean;
  sendDate: boolean;
  finished: boolean;

  writeContinue() {

  }


  addTrailers(headers: any) {

  }

  end() {
    this.emit("finish");
  }

  writeHead(statusCode: number, headers?: any) {

  }


  setHeader(name: string, value: string | string[]) {

  };

  setTimeout(msecs: number, callback: Function): ServerResponse {
    return null;
  };

  getHeader(name: string): string {
    return null;
  }

  removeHeader(name: string) {
    return null;
  }

  write(value: Buffer | string,
        encoding?: string | Function,
        cb?: Function | string): boolean {

    return false;
  }

}
