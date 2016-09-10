import {RouteParser} from "../router/route-parser";
describe("RouterParser", () => {
  it("Initialize", () => {
    let three = RouteParser.toUrlThree("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
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
  });
});
