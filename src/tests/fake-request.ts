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

// use chai spies
use(sinonChai);

describe("fakeHttpServer", () => {

  let server: FakeServerApi;

  beforeEach(() => {

    @Controller({
      name: "core"
    })
    class MyController {

      @Before("index")
      beforeAction() {
        return "BEFORE";
      }

      @Action("index")
      actionIndex(@Chain data) {
        return "VALUE <- " + data;
      }
    }

    @Module({
      name: "root",
      providers: [Logger, Router],
      controllers: [MyController]
    })
    class MyModule implements IAfterConstruct {
      afterConstruct(): void {
        this.router.addRules([{
          methods: [Methods.GET],
          url: "/",
          route: "core/index"
        }]);
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


});
