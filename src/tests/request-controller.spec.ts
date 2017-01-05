import {Methods} from "../router/router";
import {Injector} from "../injector/injector";
import {ResolvedRoute} from "../interfaces/iroute";
import {Request, ControllerResolver} from "../server/request";
import {assert, expect, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, stub, assert as assertSpy} from "sinon";
import {EventEmitter} from "events";
import {isEqual, uuid} from "../core";
import {Logger} from "../logger/logger";
import {AssertionError} from "assert";
import {Action} from "../decorators/action";
import {Metadata} from "../injector/metadata";

// use chai spies
use(sinonChai);

describe("ControllerResolver", () => {


  let resolvedRoute: ResolvedRoute;
  let eventEmitter;
  let controllerResolver: ControllerResolver;
  let controllerProvider, IRequest, request, response, data, id = uuid(), url = "/";
  let actionName = "action";

  beforeEach(() => {
    resolvedRoute = {
      method: Methods.GET,
      params: {
        a: 1,
        b: 2
      },
      route: "core/index"
    };
    response = new EventEmitter();
    request = new EventEmitter();
    data = [new Buffer(1), new Buffer(1)];
    controllerProvider = {};
    IRequest = {};
    eventEmitter = new EventEmitter();
    let injector = Injector.createAndResolve(ControllerResolver, [
      {provide: "data", useValue: data},
      {provide: "request", useValue: request},
      {provide: "response", useValue: response},
      {provide: "url", useValue: url},
      {provide: "UUID", useValue: id},
      {provide: "controllerProvider", useValue: controllerProvider},
      {provide: "actionName", useValue: actionName},
      {provide: "resolvedRoute", useValue: resolvedRoute},

      {provide: "isRedirected", useValue: false},
      {provide: "isCustomError", useValue: false},
      {provide: "isForwarded", useValue: false},
      {provide: "isForwarder", useValue: false},
      {provide: "isChainStopped", useValue: false},
      {provide: EventEmitter, useValue: eventEmitter},
      {provide: Request, useValue: IRequest},
      Logger
    ]);
    controllerResolver = injector.get(ControllerResolver);
  });

  it("ControllerResolver.constructor", () => {
    assert.isTrue(controllerResolver instanceof ControllerResolver);
  });

  it("ControllerResolver.setStatusCode", () => {
    let aSpy = spy(eventEmitter, "emit");
    controllerResolver.setStatusCode(400);
    assertSpy.calledWith(aSpy, "statusCode", 400);
  });

  it("ControllerResolver.setContentType", () => {
    let contentType = "application/json";
    let aSpy = spy(eventEmitter, "emit");
    controllerResolver.setContentType(contentType);
    assertSpy.calledWith(aSpy, "contentType", contentType);
  });

  it("ControllerResolver.stopActionChain", () => {
    assert.isFalse(Reflect.get(controllerResolver, "isChainStopped"));
    controllerResolver.stopActionChain();
    assert.isTrue(Reflect.get(controllerResolver, "isChainStopped"));
  });

  it("ControllerResolver.destroy", () => {
    let aSpy = spy(eventEmitter, "emit");
    let bSpy = spy(eventEmitter, "removeAllListeners");
    controllerResolver.destroy();
    assertSpy.calledWith(aSpy, "destroy");
    assertSpy.called(bSpy);
  });

  it("ControllerResolver.getEventEmitter", () => {
    assert.isTrue(isEqual(controllerResolver.getEventEmitter(), eventEmitter));
  });

  it("ControllerResolver.getIncomingMessage", () => {
    assert.isTrue(isEqual(controllerResolver.getIncomingMessage(), request));
  });

  it("ControllerResolver.getServerResponse", () => {
    assert.isTrue(isEqual(controllerResolver.getServerResponse(), response));
  });

  it("ControllerResolver.getRequestBody", () => {
    assert.isTrue(isEqual(controllerResolver.getRequestBody(), Buffer.concat(data)));
  });

  it("ControllerResolver.getUUID", () => {
    assert.isTrue(isEqual(controllerResolver.getUUID(), id));
  });

  it("ControllerResolver.process", () => {
    let aSpy = stub(controllerResolver, "processController");
    aSpy.returnsArg(0);
    let arg = controllerResolver.process();
    assertSpy.calledWith(aSpy, arg, controllerProvider, actionName);
  });

  it("ControllerResolver.hasMappedAction", () => {
    class B {
      @Action("index")
      index() {

      }
    }
    let provider = Metadata.verifyProvider(B);
    assert.isTrue(controllerResolver.hasMappedAction(provider, "index"));
    assert.isFalse(controllerResolver.hasMappedAction(provider, "nomappedAction"));
  });
});
