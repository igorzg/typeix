import {Methods, Router} from "../router/router";
import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {assert} from "chai";
import {isEqual} from "../core";

describe("Router", () => {

  let router: Router;

  beforeEach(() => {
    let rootInjector = new Injector();
    let injector = Injector.createAndResolve(Router, [
      {provide: Injector, useValue: rootInjector},
      {provide: Logger, useClass: Logger}
    ]);
    router = injector.get(Router);
  });

  it("Parse request and create url", () => {

    router.addRules([
      {
        methods: [Methods.OPTIONS],
        route: "controller/test",
        url: "*"
      },
      {
        methods: [Methods.GET, Methods.POST],
        route: "controller/index",
        url: "/"
      },
      {
        methods: [Methods.GET, Methods.POST],
        route: "controller/home",
        url: "/home"
      },
      {
        methods: [Methods.GET],
        route: "controller/view",
        url: "/home/<id:(\\d+)>"
      }
    ]);


    return Promise.all([
      router.parseRequest("/", "POST", {}),
      router.parseRequest("/authenticate", "OPTIONS", {}),
      router.parseRequest("/home", "GET", {}),
      router.parseRequest("/home/123", "GET", {}),
      router.createUrl("controller/view", {id: 123}),
      router.createUrl("controller/index", {}),
      router.createUrl("controller/home", {}),
      router.createUrl("controller/indexs", {})
    ]).then((data) => {
      let result = [
        {
          method: Methods.POST,
          params: {},
          route: "controller/index"
        },
        {
          method: Methods.OPTIONS,
          params: {},
          route: "controller/test"
        },
        {
          method: Methods.GET,
          params: {},
          route: "controller/home"
        },
        {
          method: Methods.GET,
          params: {
            id: "123"
          },
          route: "controller/view"
        },
        "/home/123",
        "/",
        "/home",
        "/controller/indexs"
      ];

      assert.isTrue(isEqual(data, result));
    });

  });


  it("Should invoke getError|hasError|setError", () => {
    let route = "core/error";
    router.setError(route);
    assert.isTrue(router.hasError());
    assert.equal(route, router.getError());
    router.setError("ABC/D"); // ignore second global route definition
    assert.equal(route, router.getError());
    router.setError("admin/error/index");
    assert.equal("admin/error/index", router.getError("admin"));
  });

});
