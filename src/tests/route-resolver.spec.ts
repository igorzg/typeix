import {assert, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, assert as assertSpy} from "sinon";
import {ResolvedRoute} from "../interfaces/iroute";
import {Methods, Router} from "../router/router";
import {uuid} from "../core";
import {EventEmitter} from "events";
import {Injector} from "../injector/injector";
import {RouteResolver} from "../server/route-resolver";
import {parse} from "url";
import {Logger} from "../logger/logger";
import {IResolvedModule, IModule} from "../interfaces/imodule";
import {Module} from "../decorators/module";
import {Controller} from "../decorators/controller";
import {Action} from "../decorators/action";
import {createModule, getModule} from "../server/bootstrap";
import {IProvider} from "../interfaces/iprovider";
import {Metadata} from "../injector/metadata";

// use chai spies
use(sinonChai);

describe("RouteResolver", () => {
  let resolvedRoute: ResolvedRoute;
  let routeResolver: RouteResolver;
  let request, response, data, id = uuid();

  beforeEach(() => {
    resolvedRoute = {
      method: Methods.GET,
      params: {
        a: 1,
        b: 2
      },
      route: "core/index"
    };
    class ResponseEmitter extends EventEmitter {
      writeHead() {}
      write() {}
      end() {}
      invalid() {
        return 1;
      }
    }
    response = new ResponseEmitter();
    request = new ResponseEmitter();
    data = [new Buffer(1), new Buffer(1)];
    let injector = Injector.createAndResolveChild(
      new Injector(),
      RouteResolver,
      [
        Logger,
        Router,
        {provide: "url", useValue: parse("/", true)},
        {provide: "UUID", useValue: id},
        {provide: "data", useValue: data},
        {provide: "contentType", useValue: "text/html"},
        {provide: "statusCode", useValue: 200},
        {provide: "request", useValue: request},
        {provide: "response", useValue: response},
        {provide: "modules", useValue: []},
        EventEmitter
      ]
    );
    routeResolver = injector.get(RouteResolver);
  });


  it("Should initialize", () => {
    assert.isNotNull(routeResolver);
  });

  it("Should render", () => {
    let toRender = "RENDER";
    let aSpy = spy(response, "writeHead");
    let a2Spy = spy(response, "write");
    let a3Spy = spy(response, "end");
    let rendered = routeResolver.render(toRender);
    assertSpy.calledWith(aSpy, 200, {"Content-Type": "text/html"});
    assertSpy.calledWith(a2Spy, toRender);
    assertSpy.called(a3Spy);
    assert.equal(rendered, toRender);
  });

  it("Should render throws error", () => {
    assert.throws(() => {
      routeResolver.render(Reflect.get(response, "invalid").call());
    }, "ResponseType must be string or buffer");
  });



  it("Should getControllerProvider", () => {

    @Controller({
      name: "core"
    })
    class MyController {

      @Action("index")
      actionIndex() {}
    }

    @Module({
      name: "root",
      controllers: [MyController]
    })
    class MyModule {}

    let modules: Array<IModule> = createModule(MyModule);
    let module: IResolvedModule = {
      module: getModule(modules),
      controller: "core",
      action: "index",
      resolvedRoute,
      data
    };

    let provider = Metadata.verifyProvider(MyController);
    let controllerProvider: IProvider = routeResolver.getControllerProvider(module);
    assert.deepEqual(provider, controllerProvider);
  });



  it("Should getControllerProvider no route", () => {

    @Controller({
      name: "core"
    })
    class MyController {

      @Action("index")
      actionIndex() {}
    }

    @Module({
      name: "root",
      controllers: [MyController]
    })
    class MyModule {}

    let modules: Array<IModule> = createModule(MyModule);
    let module: IResolvedModule = {
      module: getModule(modules),
      controller: "test",
      action: "index",
      resolvedRoute,
      data
    };

    assert.throws(() => {
      routeResolver.getControllerProvider(module);
    }, "You must define controller within current route: core/index");
  });

});
