import {RouteRule} from "../router/route-rule";
import {Methods} from "../router/router";
import {Injector} from "../injector";
describe("RouteRule", () => {
  it("Initialize", (done) => {
    let config = {
      methods: [Methods.GET, Methods.POST],
      route: "core/index",
      url: "/home/<id:(\\d+)>"
    };
    let injector = Injector.createAndResolve(RouteRule, [{provide: "config", useValue: config}]);
    let route = injector.get(RouteRule);
    expect(route).not.toBeNull();
    Promise
      .all([
        route.parseRequest("/home/123", "GET", {}),
        route.parseRequest("/home/123", "POST", {}),
        route.parseRequest("/home/123", "CONNECT", {}),
        route.createUrl("core/index", {id: 123})
      ])
      .then(data => {
        let result = [
          {
            method: Methods.GET,
            params: {
              id: "123"
            },
            path: "/home/123",
            route: "core/index"
          },
          {
            method: Methods.POST,
            params: {
              id: "123"
            },
            path: "/home/123",
            route: "core/index"
          },
          false,
          "/home/123"
        ];
        expect(data).toEqual(result);
        done();
      });
  });
});
