import {RouteRule} from "../router/route-rule";
describe("RouteRule", () => {
  it("Initialize", () => {
    let routeRule = new RouteRule();
    expect(routeRule).not.toBeNull();
  });
});
