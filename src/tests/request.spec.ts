import {Methods} from "../router/router";
import {Injector} from "../injector/injector";
import {ResolvedRoute} from "../interfaces/iroute";
import {Request, ControllerResolver} from "../server/request";
import {assert, expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, stub, assert as assertSpy} from "sinon";
import {EventEmitter} from "events";
import {IConnection} from "../interfaces/iconnection";
import {isEqual} from "../core";

// use chai spies
use(sinonChai);

describe("Request", () => {


  let resolvedRoute: ResolvedRoute = {
    method: Methods.GET,
    params: {},
    route: "core/index"
  };
  let eventEmitter = new EventEmitter();

  let incommingMessage = Object.create({
    headers: {}
  });

  let controllerResolver = Object.create({
    getEventEmitter: () => {
      return eventEmitter;
    },
    getIncomingMessage: () => {
      return incommingMessage;
    },
    getRequestBody: () => {
    },
    getUUID: () => "1",
    setStatusCode: () => {
    },
    stopActionChain: () => {
    }
  });

  let request: Request;

  beforeEach(() => {
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
});
