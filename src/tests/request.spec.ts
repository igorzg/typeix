import {Methods} from "../router/router";
import {Injector} from "../injector/injector";
import {IResolvedRoute} from "../interfaces/iroute";
import {ControllerResolver} from "../server/controller-resolver";
import {assert, expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {assert as assertSpy, spy, stub} from "sinon";
import {EventEmitter} from "events";
import {isEqual, uuid} from "../core";
import {BaseRequest, Request} from "../server/request";

// use chai spies
use(sinonChai);

describe("BaseRequest", () => {
  const resolvedRoute: IResolvedRoute = {
    method: Methods.GET,
    params: {
      a: 1,
      b: 2
    },
    route: "core/index"
  };
  const incomingMessage = Object.create({
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
    },
    headers: {}
  });
  const data: Array<Buffer> = [Buffer.from(["a", "b", "c"])];
  const UUID: string = uuid();

  let request: BaseRequest;

  beforeEach(() => {
    const injector = Injector.createAndResolve(BaseRequest, [
      {provide: "resolvedRoute", useValue: resolvedRoute},
      {provide: "request", useValue: incomingMessage},
      {provide: "UUID", useValue: UUID},
      {provide: "data", useValue: data}
    ]);
    request = injector.get(BaseRequest);
  });

  it("BaseRequest.constructor", () => {
    assert.isTrue(request instanceof BaseRequest);
  });

  it("BaseRequest.getConnection", () => {
    let conn = request.getConnection();
    assert.deepEqual(conn, {
      uuid: UUID,
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
    });
  });

  it("BaseRequest.getCookies", () => {
    let aSpy = stub(request, "getRequestHeader");
    aSpy.returns("__id=d6ad83ce4a84516bf7d438504e81b139a1483565272; __id2=1;");
    let requestCookies = request.getCookies();
    let cookies = {
      __id: "d6ad83ce4a84516bf7d438504e81b139a1483565272",
      __id2: "1"
    };
    assertSpy.called(aSpy);
    assert.isTrue(isEqual(requestCookies, cookies));
  });

  it("BaseRequest.getCookie", () => {
    let aSpy = stub(request, "getCookies");
    aSpy.returns({
      __id: "d6ad83ce4a84516bf7d438504e81b139a1483565272",
      __id2: "1"
    });
    let id = request.getCookie("__id");
    assertSpy.called(aSpy);
    assert.equal(id, "d6ad83ce4a84516bf7d438504e81b139a1483565272");
  });

  it("BaseRequest.getCookies null", () => {
    let aSpy = stub(request, "getRequestHeader");
    aSpy.returns(null);
    let requestCookies = request.getCookies();
    let cookies = {};
    assertSpy.called(aSpy);
    assert.isTrue(isEqual(requestCookies, cookies));
  });

  it("BaseRequest.getRequestHeaders", () => {
    let rHeaders = request.getRequestHeaders();
    assert.isTrue(isEqual(rHeaders, {}));
  });

  it("BaseRequest.getRequestHeader", () => {
    let aSpy = stub(request, "getRequestHeaders");
    let headers = {accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"};
    aSpy.returns(headers);
    let rHeaders = request.getRequestHeader("Accept");
    assertSpy.called(aSpy);
    assert.isTrue(isEqual(rHeaders, headers.accept));
  });

  it("BaseRequest.getParams", () => {
    assert.isTrue(isEqual(request.getParams(), resolvedRoute.params));
  });

  it("BaseRequest.getParam", () => {
    assert.isTrue(isEqual(request.getParam("a"), 1));
  });

  it("BaseRequest.getMethod", () => {
    assert.isTrue(isEqual(request.getMethod(), Methods.GET));
  });

  it("BaseRequest.getRoute", () => {
    assert.isTrue(isEqual(request.getRoute(), "core/index"));
  });

  it("BaseRequest.getBody", () => {
    const body = request.getBody();
    assert.isTrue(isEqual(body, Buffer.concat(data)));
  });
});

describe("Request", () => {
  const resolvedRoute: IResolvedRoute = {
    method: Methods.GET,
    params: {
      a: 1,
      b: 2
    },
    route: "core/index"
  };
  const incomingMessage = Object.create({
    headers: {}
  });
  const data = [Buffer.from(["a", "b", "c"])];
  const UUID = 1;

  let eventEmitter: EventEmitter;
  let controllerResolver: ControllerResolver;
  let request: Request;

  beforeEach(() => {
    eventEmitter = new EventEmitter();

    controllerResolver = Object.create({
      getEventEmitter: () => {
        return eventEmitter;
      },
      getRequestHeader: () => {
        // dummy
      },
      getServerResponse: () => {
        // dummy
      },
      getIncomingMessage: () => {
        return incomingMessage;
      },
      getResolvedRoute: () => {
        return resolvedRoute;
      },
      getId: () => {
        return UUID;
      },
      getRawData: () => {
        return data;
      },
      setContentType: () => {
        // dummy
      },
      setStatusCode: () => {
        // dummy
      },
      stopChain: () => {
        // dummy
      }
    });
    let injector = Injector.createAndResolve(Request, [
      {provide: "controllerResolver", useValue: controllerResolver}
    ]);
    request = injector.get(Request);
  });

  it("Request.constructor", () => {
    assert.isTrue(request instanceof Request);
  });

  it("Request.onDestroy", () => {
    let eSpy = spy(controllerResolver, "getEventEmitter");
    let isCalled = false;

    function destroy() {
      isCalled = true;
    }

    request.onDestroy(destroy);
    assertSpy.called(eSpy);

    expect(EventEmitter.listenerCount(eventEmitter, "destroy")).to.be.eq(1);
    eventEmitter.emit("destroy");
    assert.isTrue(isCalled);
  });

  it("Request.setResponseHeader", () => {
    let api = {
      setHeader: (a, b) => {
        // dummy
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
    let aSpy = spy(eventEmitter, "emit");
    request.setContentType("application/javascript");
    assertSpy.calledWith(aSpy, "contentType", "application/javascript");
  });

  it("Request.setStatusCode", () => {
    let aSpy = spy(eventEmitter, "emit");
    request.setStatusCode(400);
    assertSpy.calledWith(aSpy, "statusCode", 400);
  });

  it("Request.stopChain", () => {
    let aSpy = stub(controllerResolver, "stopChain");
    request.stopChain();
    assertSpy.called(aSpy);
  });
});
