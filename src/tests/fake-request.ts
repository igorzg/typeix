import {use, assert} from "chai";
import * as sinonChai from "sinon-chai";
import {Methods, Router} from "../router/router";
import {Logger} from "../logger/logger";
import {Module} from "../decorators/module";
import {Controller} from "../decorators/controller";
import {Action, Before} from "../decorators/action";
import {IAfterConstruct} from "../interfaces/iprovider";
import {Inject} from "../decorators/inject";
import {fakeHttpServer, FakeServerApi} from "../server/fake-http";
import {Chain} from "../decorators/chain";
import {Request} from "../server/request";

// use chai spies
use(sinonChai);

describe("fakeHttpServer", () => {

  let server: FakeServerApi;

  beforeEach(() => {

    @Controller({
      name: "core"
    })
    class MyController {

      @Inject(Request)
      private request: Request;

      @Before("index")
      beforeIndex() {
        return "BEFORE";
      }

      @Action("index")
      actionIndex(@Chain data) {
        return "VALUE <- " + data;
      }

      @Action("call")
      actionAjax() {
        return "CALL=" + this.request.getBody();
      }
    }

    @Module({
      name: "root",
      providers: [Logger, Router],
      controllers: [MyController]
    })
    class MyModule implements IAfterConstruct {
      afterConstruct(): void {
        this.router.addRules([
          {
            methods: [Methods.GET],
            url: "/",
            route: "core/index"
          },
          {
            methods: [Methods.POST],
            url: "/ajax/call",
            route: "core/call"
          }
        ]);
      }

      @Inject(Router)
      private router: Router;
    }

    server = fakeHttpServer(MyModule);
  });


  it("Should do GET index", (done) => {
    server.GET("/").then(data => {
      assert.equal(data, "VALUE <- BEFORE");
      done();
    }).catch(done);
  });


  it("Should do POST index", (done) => {
    server.POST("/ajax/call", Buffer.from("SENT_FROM_CLIENT")).then(data => {
      assert.equal(data, "CALL=SENT_FROM_CLIENT");
      done();
    }).catch(done);
  });

});
