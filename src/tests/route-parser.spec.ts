import {RouteParser} from "../router/route-parser";

describe("RouterParser", () => {
  it("Initialize", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
    expect(pattern instanceof RouteParser).toBeTruthy();
  });

  it("Should test patterns", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
    expect(pattern.isValid("")).toBeFalsy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306-not/user/1412")).toBeTruthy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306-not/user/1412a")).toBeFalsy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306-not/user/1412/abc")).toBeFalsy();
    expect(pattern.isValid("/igor/should#+do-it/whata-smile-now-2306-not/user/1412")).toBeFalsy();
    expect(pattern.isValid("//igor/should#+do-it/whata-smile-now-2306-not/user/1412")).toBeFalsy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306-not/usera/1412")).toBeFalsy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306a-not/user/1412")).toBeFalsy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-nowa-2306-not/user/1412")).toBeFalsy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata1231-smile-now-2306-not/user/1412")).toBeTruthy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata1231!-smile-now-2306-not/user/1412")).toBeFalsy();
    expect(pattern.isValid("/canbeone/igor/should#+do-it/whata123-smile123-now-2306-not/user/1412")).toBeFalsy();
    expect(pattern.isValid("/canbeone/igor/should--be-able-do-it/whata123-smile-now-2306-not/user/1412")).toBeFalsy();
    expect(pattern.isValid("/can1454zfhg=?`='(    ()=(one/igor/should#+do-it/whata-smile-now-2306-not/user/1412")).toBeTruthy();
  });

  it("Should get correct parameters", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
    let url = "/can1454zfhg=?`='(    ()=(one/igor/should#+do-it/whata-smile-now-2306-not/user/1412";
    let params = pattern.getParams(url);
    expect(params).toEqual({
      id: "1412",
      see: "whata",
      nice: "smile",
      only: "2306",
      now: "#+",
      name: "igor",
      any: "1454zfhg=?`=\'(    ()=("
    });
    expect(pattern.createUrl(params)).toBe(url);
  });

  it("Should test patterns2", () => {
    let pattern = RouteParser.parse("/assets/<file:(.*)>");
    expect(pattern.isValid("")).toBeFalsy();
    expect(pattern.isValid("/assets/css/main.css")).toBeTruthy();
  });

  it("Should get correct parameters", () => {
    let pattern = RouteParser.parse("/assets/<file:(.*)>");
    let url = "/assets/css/main.css";
    let params = pattern.getParams(url);
    expect(params).toEqual({file: "css/main.css"});
    expect(pattern.createUrl(params)).toBe(url);
  });
});
