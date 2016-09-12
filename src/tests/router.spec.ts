import {Methods, Router} from "../router/router";
import {Injector} from "../injector";
import {Logger} from "../logger/logger";
import {assert, expect} from "chai";
import {isEqual} from "../core";

describe("Router", () => {
  it("Parse and create", () => {
    let rootInjector = new Injector();
    let injector = Injector.createAndResolve(Router, [
      {provide: Injector, useValue: rootInjector},
      {provide: Logger, useClass: Logger}
    ]);
    let router: Router = injector.get(Router);
    router.addRules([
      {
        url: "/",
        route: "controller/index",
        methods: [Methods.GET, Methods.POST]
      },
      {
        url: "/home",
        route: "controller/home",
        methods: [Methods.GET, Methods.POST]
      }
    ]);


    return Promise.all([
      router.parseRequest("/", "POST", {}),
      router.parseRequest("/home", "GET", {}),
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
        "/",
        "/home",
        "/controller/indexs"
      ];
      assert.isTrue(isEqual(data, result));
    });

  });
});
