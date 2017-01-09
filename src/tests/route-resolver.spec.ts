import {assert, use} from "chai";
import * as sinonChai from "sinon-chai";
import {spy, stub, assert as assertSpy} from "sinon";
import {ResolvedRoute} from "../interfaces/iroute";
import {Methods, Router} from "../router/router";
import {uuid} from "../core";
import {EventEmitter} from "events";
import {Injector} from "../injector/injector";
import {RouteResolver} from "../server/route-resolver";
import {parse} from "url";
import {Logger} from "../logger/logger";

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
    response = new EventEmitter();
    request = new EventEmitter();
    data = [new Buffer(1), new Buffer(1)];
  });


  it("Should initialize", () => {
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
    assert.isNotNull(routeResolver);
  });

});
