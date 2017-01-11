import {use, assert} from "chai";
import * as sinonChai from "sinon-chai";
import {Methods, Router} from "../router/router";
import {Logger} from "../logger/logger";
import {Module} from "../decorators/module";
import {Controller} from "../decorators/controller";
import {Action, Before} from "../decorators/action";
import {IAfterConstruct} from "../interfaces/iprovider";
import {Inject} from "../decorators/inject";
import {fakeHttpServer, FakeServerApi, FakeResponseApi} from "../server/fake-http";
import {Chain} from "../decorators/chain";
import {Request} from "../server/controller-resolver";
import {Status} from "../server/status-code";
import {isEqual} from "../core";
import {HttpError} from "../error";
import {ErrorMessage} from "../decorators/error";

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


      @Action("error")
      actionError(@ErrorMessage message: HttpError) {
        return "ERROR=" + message.getMessage();
      }


      @Action("fire")
      actionFireError() {
        throw new HttpError(500, "FIRE ERROR CASE");
      }

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

      @Action("redirect")
      actionRedirect() {
        return this.request.redirectTo("/mypage", Status.Temporary_Redirect);
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
      }

      @Inject(Router)
      private router: Router;
    }

    server = fakeHttpServer(MyModule);
  });


  it("Should do GET redirect", (done) => {
    server.GET("/redirect").then((api: FakeResponseApi) => {
      assert.equal(api.getStatusCode(), 307);
      assert.isTrue(isEqual(api.getHeaders(), {"Location": "/mypage"}));
      done();
    }).catch(done);
  });

  it("Should do GET found error", (done) => {
    server.GET("/fire-error").then((api: FakeResponseApi) => {
      assert.isTrue(api.getBody().toString().indexOf("ERROR=FIRE ERROR CASE") > -1);
      assert.equal(api.getStatusCode(), 500);
      done();
    }).catch(done);
  });


  it("Should do GET not found", (done) => {
    server.GET("/abc").then((api: FakeResponseApi) => {
      assert.isTrue(api.getBody().toString().indexOf("ERROR=Router.parseRequest: /abc no route found, method: GET") > -1);
      assert.equal(api.getStatusCode(), 404);
      done();
    }).catch(done);
  });

  it("Should do GET index", (done) => {
    server.GET("/").then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "VALUE <- BEFORE");
      assert.equal(api.getStatusCode(), 200);
      done();
    }).catch(done);
  });

  it("Should do OPTIONS index", (done) => {
    server.OPTIONS("/").then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "VALUE <- BEFORE");
      assert.equal(api.getStatusCode(), Status.OK);
      done();
    }).catch(done);
  });

  it("Should do CONNECT index", (done) => {
    server.CONNECT("/").then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "VALUE <- BEFORE");
      done();
    }).catch(done);
  });

  it("Should do DELETE index", (done) => {
    server.DELETE("/").then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "VALUE <- BEFORE");
      done();
    }).catch(done);
  });

  it("Should do HEAD index", (done) => {
    server.HEAD("/").then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "VALUE <- BEFORE");
      done();
    }).catch(done);
  });

  it("Should do TRACE index", (done) => {
    server.TRACE("/").then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "VALUE <- BEFORE");
      done();
    }).catch(done);
  });

  it("Should do POST index", (done) => {
    server.POST("/ajax/call", Buffer.from("SENT_FROM_CLIENT")).then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "CALL=SENT_FROM_CLIENT");
      done();
    }).catch(done);
  });

  it("Should do PUT index", (done) => {
    server.PUT("/ajax/call", Buffer.from("SENT_FROM_CLIENT")).then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "CALL=SENT_FROM_CLIENT");
      done();
    }).catch(done);
  });

  it("Should do PATCH index", (done) => {
    server.PATCH("/ajax/call", Buffer.from("SENT_FROM_CLIENT")).then((api: FakeResponseApi) => {
      assert.equal(api.getBody().toString(), "CALL=SENT_FROM_CLIENT");
      done();
    }).catch(done);
  });



});
