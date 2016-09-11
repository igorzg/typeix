import {RouteRule} from "../router/route-rule";
import {Methods} from "../interfaces/iroute";
describe("RouteRule", () => {
  it("Initialize", () => {
    let routeRule = new RouteRule({
      url: "/home",
      route: "core/index",
      methods: [Methods.GET, Methods.POST]
    });
    expect(routeRule).not.toBeNull();
  });
});
