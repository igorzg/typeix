import {assert, use} from "chai";
import * as sinonChai from "sinon-chai";
import {Methods, Router} from "../router/router";
import {Logger, LogLevels} from "../logger/logger";
import {Module} from "../decorators/module";
import {IAfterConstruct} from "../interfaces/iprovider";
import {Inject} from "../decorators/inject";
import {fakeHttpServer, FakeServerApi} from "../server/mocks";
import {WebSocket} from "../decorators/websocket";
import {Hook} from "../decorators/action";

// use chai spies
use(sinonChai);

describe("fakeHttpServer with Sockets", () => {

  let server: FakeServerApi;

  beforeEach(() => {

    @WebSocket({
      name: "socket"
    })
    class MySocket {
      @Inject(Logger)
      private readonly logger: Logger;

      @Hook("verify")
      verify(): void {
        this.logger.debug("Doing verification...");
      }
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
            methods: [Methods.GET],
            url: "/echo",
            route: "socket"
          }
        ]);
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


  it("Should create a socket", (done) => {
    server.openSocket("/echo")
      .then(api => {
        assert.isDefined(api);
        done();
      })
      .catch(done);
  });

});
