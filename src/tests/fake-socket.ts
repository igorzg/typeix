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
import {BaseRequest} from "../server/request";
import {HttpError} from "../error";
import {Socket} from "../server/socket";
import {IAfterClose} from "../interfaces/iwebsocket";
import {Param} from "../decorators";

// use chai spies
use(sinonChai);

describe("fakeHttpServer with Sockets", () => {

  let server: FakeServerApi;
  let dummyResourceLocked = false;

  beforeEach(() => {

    @WebSocket({
      name: "socket"
    })
    class MySocket implements IAfterClose {
      @Inject(Logger)
      private readonly logger: Logger;

      @Inject(BaseRequest)
      private readonly request: BaseRequest;

      private socket: Socket;
      private name: string;

      @Hook("verify")
      verify(): void {
        if (this.request.getRequestHeader("should-fail")) {
          throw new HttpError(403, "You shall not pass");
        }
      }

      @Hook("open")
      open(@Inject(Socket) socket: Socket, @Param("name") name: string) {
        this.socket = socket;
        this.name = name;
        dummyResourceLocked = true;

        if (this.request.getRequestHeader("send-name")) {
          this.socket.send(name);
        }
      }

      @Hook("message")
      receive(@Inject("message") message: any): void {
        this.socket.send(message);

        if (message === "timer") {
          setTimeout(() => {
            this.socket.send("timeout");
          }, 200);
        }
      }

      afterClose(): void {
        dummyResourceLocked = false;
      }
    }

    @Module({
      name: "root",
      providers: [Logger, Router],
      sockets: [MySocket]
    })
    class MyModule implements IAfterConstruct {
      @Inject(Logger)
      private readonly logger: Logger;

      @Inject(Router)
      private readonly router: Router;

      afterConstruct(): void {
        this.router.addRules([
          {
            methods: [Methods.GET],
            url: "/echo",
            route: "socket"
          },
          {
            methods: [Methods.GET],
            url: "/echo-<name:([A-Z]+)>",
            route: "socket"
          }

        ]);
        this.logger.printToConsole();
        this.logger.enable();
        this.logger.setDebugLevel(LogLevels.BENCHMARK);
      }
    }

    server = fakeHttpServer(MyModule);
  });


  it("Should create a socket", (done) => {
    server.createSocket("/echo")
      .then(api => {
        assert.isDefined(api);
        done();
      })
      .catch(done);
  });

  it("Should fail verification when header is set", (done) => {
    server
      .createSocket("/echo", {
        "should-fail": true
      })
      .then(api => {
        assert.fail();
      }, error => {
        assert.instanceOf(error, HttpError);
        assert.equal(error.getCode(), 403);
      })
      .then(done, done);
  });

  it("Should extract parameters properly", (done) => {
    server
      .createSocket("/echo-VINCENT", {
        "send-name": true
      })
      .then(api =>
        api.open()
          .then(() => {
            assert.equal(api.getLastReceivedMessage(), "VINCENT");
          })
      )
      .then(done, done);
  });


  it("Should be possible to echo a message", (done) => {
    server
      .createSocket("/echo")
      .then(api =>
        api
          .open()
          .then(() => {
            api.send("test data");
            assert.equal(api.getLastReceivedMessage(), "test data");
            api.close();
          })
      )
      .then(done, done);
  });

  it("Should send a message after timeout without direct echo", (done) => {
    server
      .createSocket("/echo")
      .then(api =>
        api
          .open()
          .then(() => {
            api.onMessage(message => {
              if (message === "timeout") {
                api.close();
                done();
              }
            });
            api.send("timer");
          })
      )
      .catch(done);
  });

  it("Should free resources after close", (done) => {
    server
      .createSocket("/echo")
      .then(api =>
        api
          .open()
          .then(() => {
            api.close();
            assert.equal(dummyResourceLocked, false);
          })
      )
      .then(done, done);
  });
});
