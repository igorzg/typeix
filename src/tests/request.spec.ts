import {Methods} from "../router/router";
import {Injector} from "../injector/injector";
import {ResolvedRoute} from "../interfaces/iroute";
import {Request, ControllerResolver} from "../server/controller-resolver";
import {assert, expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, stub, assert as assertSpy} from "sinon";
import {EventEmitter} from "events";
import {IConnection} from "../interfaces/iconnection";
import {isEqual} from "../core";

// use chai spies
use(sinonChai);

describe("Request", () => {


  let resolvedRoute: ResolvedRoute;
  let eventEmitter = new EventEmitter();

  let incommingMessage = Object.create({
    headers: {}
  });

  let controllerResolver;

  let request: Request;

  beforeEach(() => {
    resolvedRoute = {
      method: Methods.GET,
      params: {
        a: 1,
        b: 2
      },
      route: "core/index"
    };
    controllerResolver = Object.create({
      getEventEmitter: () => {
        return eventEmitter;
      },
      getRequestHeader: () => {
      },
      getServerResponse: () => {
      },
      getIncomingMessage: () => {
        return incommingMessage;
      },
      setContentType: () => {
      },
      getBody: () => {
      },
      getUUID: () => "1",
      setStatusCode: () => {
      },
      stopChain: () => {
      }
    });
    let injector = Injector.createAndResolve(Request, [
      {provide: "resolvedRoute", useValue: resolvedRoute},
      {provide: ControllerResolver, useValue: controllerResolver}
    ]);
    request = injector.get(Request);
  });

  it("Request.constructor", () => {
    assert.isTrue(request instanceof Request);
  });

  it("Request.onDestroy", () => {
    let eSpy = spy(controllerResolver, "getEventEmitter");
    let isCalled = false;

    function destory() {
      isCalled = true;
    }

    request.onDestroy(destory);
    assertSpy.called(eSpy);

    expect(EventEmitter.listenerCount(eventEmitter, "destroy")).to.be.eq(1);
    eventEmitter.emit("destroy");
    assert.isTrue(isCalled);
  });


  it("Request.getConnection", () => {
    let connection = {
      uuid: "1",
      method: "GET",
      url: "/",
      httpVersion: "1.1",
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      connection: {
        remoteAddress: "192.0.0.1",
        remoteFamily: "",
        remotePort: 9000,
        localAddress: "192.0.0.1",
        localPort: 9000
      }
    };
    let aSpy = stub(controllerResolver, "getIncomingMessage");
    aSpy.returns(connection);
    let bSpy = spy(controllerResolver, "getUUID");

    let data = request.getConnection();

    assertSpy.called(aSpy);
    assertSpy.called(bSpy);

    assert.isTrue(isEqual(data, {
      uuid: "1",
      method: "GET",
      url: "/",
      httpVersion: "1.1",
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      remoteAddress: "192.0.0.1",
      remoteFamily: "",
      remotePort: 9000,
      localAddress: "192.0.0.1",
      localPort: 9000
    }));
  });


  it("Request.getCookies", () => {
    let aSpy = stub(request, "getRequestHeader");
    aSpy.returns("__id=d6ad83ce4a84516bf7d438504e81b139a1483565272; __id2=1;");
    let data = request.getCookies();
    let cookies = {
      __id: "d6ad83ce4a84516bf7d438504e81b139a1483565272",
      __id2: "1"
    };
    assertSpy.called(aSpy);
    assert.isTrue(isEqual(data, cookies));
  });

  it("Request.getCookie", () => {
    let aSpy = stub(request, "getCookies");
    aSpy.returns({
      __id: "d6ad83ce4a84516bf7d438504e81b139a1483565272",
      __id2: "1"
    });
    let id = request.getCookie("__id");
    assertSpy.called(aSpy);
    assert.equal(id, "d6ad83ce4a84516bf7d438504e81b139a1483565272");
  });

  it("Request.getCookies null", () => {
    let aSpy = stub(request, "getRequestHeader");
    aSpy.returns(null);
    let data = request.getCookies();
    let cookies = {};
    assertSpy.called(aSpy);
    assert.isTrue(isEqual(data, cookies));
  });

  it("Request.setCookie", () => {
    let key = "id";
    let value = "d6ad83ce4a84516bf7d438504e81b139a1483565272";
    let expires = new Date();
    let domain = "sub.example.com";
    let path = "/test";
    let isHttpOnly = true;
    let str = "id=d6ad83ce4a84516bf7d438504e81b139a1483565272; Expires=" + expires.toUTCString() + "; Path=sub.example.com; Domain=/test; HttpOnly";
    let aSpy = stub(request, "setResponseHeader");
    request.setCookie(key, value, expires, domain, path, isHttpOnly);
    assertSpy.calledWith(aSpy, "Set-cookie", str);
  });

  it("Request.getRequestHeaders", () => {
    let aSpy = stub(controllerResolver, "getIncomingMessage");
    let headers = {
      headers: {}
    };
    aSpy.returns(headers);
    let rHeaders = request.getRequestHeaders();
    assertSpy.called(aSpy);
    assert.isTrue(isEqual(rHeaders, {}));
  });


  it("Request.getRequestHeader", () => {
    let aSpy = stub(request, "getRequestHeaders");
    let headers = {accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"};
    aSpy.returns(headers);
    let rHeaders = request.getRequestHeader("Accept");
    assertSpy.called(aSpy);
    assert.isTrue(isEqual(rHeaders, headers.accept));
  });


  it("Request.setResponseHeader", () => {
    let api = {
      setHeader: (a, b) => {
      }
    };
    let bSpy = stub(api, "setHeader");
    let aSpy = stub(controllerResolver, "getServerResponse");
    aSpy.returns(api);
    request.setResponseHeader("Content-Type", "application/javascript");
    assertSpy.called(aSpy);
    assertSpy.calledWith(bSpy, "Content-Type", "application/javascript");
  });

  it("Request.setContentType", () => {
    let aSpy = stub(controllerResolver, "setContentType");
    request.setContentType("application/javascript");
    assertSpy.calledWith(aSpy, "application/javascript");
  });


  it("Request.getParams", () => {
    assert.isTrue(isEqual(request.getParams(), resolvedRoute.params));
  });

  it("Request.getParam", () => {
    assert.isTrue(isEqual(request.getParam("a"), 1));
  });

  it("Request.getMethod", () => {
    assert.isTrue(isEqual(request.getMethod(), Methods.GET));
  });

  it("Request.getRoute", () => {
    assert.isTrue(isEqual(request.getRoute(), "core/index"));
  });

  it("Request.getBody", () => {
    let aSpy = stub(controllerResolver, "getBody");
    request.getBody();
    assertSpy.called(aSpy);
  });

  it("Request.setStatusCode", () => {
    let aSpy = stub(controllerResolver, "setStatusCode");
    request.setStatusCode(400);
    assertSpy.calledWith(aSpy, 400);
  });

  it("Request.stopChain", () => {
    let aSpy = stub(controllerResolver, "stopChain");
    request.stopChain();
    assertSpy.called(aSpy);
  });
});
