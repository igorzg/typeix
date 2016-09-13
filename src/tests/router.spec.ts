import {Methods, Router} from "../router/router";
import {Injector} from "../injector/injector";
import {Logger} from "../logger/logger";
import {assert, expect} from "chai";
import {isEqual} from "../core";

describe("Router", () => {
  it("Parse request and create url", () => {
    let rootInjector = new Injector();
    let injector = Injector.createAndResolve(Router, [
      {provide: Injector, useValue: rootInjector},
      {provide: Logger, useClass: Logger}
    ]);
    let router: Router = injector.get(Router);
    router.addRules([
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
          path: "/",
          route: "controller/index"
        },
        {
          method: Methods.GET,
          params: {},
          path: "/home",
          route: "controller/home"
        },
        {
          method: Methods.GET,
          params: {
            id: "123"
          },
          path: "/home/123",
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
});
