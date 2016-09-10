import {RouteParser} from "../router/route-parser";
import {inspect} from "../logger/inspect";
describe("RouterParser", () => {
  it("Initialize", () => {
    let three = RouteParser.toUrlTree("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
    let data = {
      child: {
        child: {
          child: {
            child: {
              child: {
                child: null,
                path: "<id:\\d+>"
              },
              path: "user"
            },
            path: "<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not"
          },
          path: "should<now:\\W+>do-it"
        },
        path: "<name:\\w+>"
      },
      path: "can<any>one"
    };
    expect(three).toEqual(data);

    console.log(inspect(new RouteParser(three), 10));
  });
});
