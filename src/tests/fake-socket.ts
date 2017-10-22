import {assert, use} from "chai";
import * as sinonChai from "sinon-chai";
import {Methods, Router} from "../router/router";
import {Logger, LogLevels} from "../logger/logger";
import {Module} from "../decorators/module";
import {IAfterConstruct} from "../interfaces/iprovider";
import {Inject} from "../decorators/inject";
import {fakeHttpServer, FakeServerApi} from "../server/mocks";
import {WebSocket} from "../decorators/websocket";

// use chai spies
use(sinonChai);

describe("fakeHttpServer with Sockets", () => {

  let server: FakeServerApi;

  beforeEach(() => {

    @WebSocket({
      name: "core"
    })
    class MySocket {
    }

    @Module({
      name: "root",
      providers: [Logger, Router],
      sockets: [MySocket]
    })
    class MyModule implements IAfterConstruct {
      afterConstruct(): void {
        this.router.addRules([
          {
            methods: [Methods.GET, Methods.OPTIONS, Methods.CONNECT, Methods.DELETE, Methods.HEAD, Methods.TRACE],
            url: "/",
            route: "core/index"
          },
          {
            methods: [Methods.POST, Methods.PUT, Methods.PATCH],
            url: "/ajax/call",
            route: "core/call"
          },
          {
            methods: [Methods.GET],
            url: "/redirect",
            route: "core/redirect"
          },
          {
            methods: [Methods.GET],
            url: "/fire-error",
            route: "core/fire"
          }
        ]);
        this.router.setError("core/error");
        this.logger.printToConsole();
        this.logger.enable();
        this.logger.setDebugLevel(LogLevels.BENCHMARK);
      }

      @Inject(Logger)
      private logger: Logger;

      @Inject(Router)
      private router: Router;
    }

    server = fakeHttpServer(MyModule);
  });


  it("Should create a socket", () => {
    const ws = server.openSocket("/echo");
    assert.isDefined(ws);
  });

});
