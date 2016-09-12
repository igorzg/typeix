import {RouteParser} from "../router/route-parser";
import {assert, expect} from "chai";
import {isEqual} from "../core";

describe("RouterParser", () => {
  it("Initialize", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>" +
      "-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
    assert.isTrue(pattern instanceof RouteParser);
  });

  it("Should test patterns on /can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>" +
      "-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
    assert.isFalse(pattern.isValid(""));
    assert.isTrue(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306-not/user/1412"));
    assert.isFalse(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306-not/user/1412a"));
    assert.isFalse(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306-not/user/1412/abc"));
    assert.isFalse(pattern.isValid("/igor/should#+do-it/whata-smile-now-2306-not/user/1412"));
    assert.isFalse(pattern.isValid("//igor/should#+do-it/whata-smile-now-2306-not/user/1412"));
    assert.isFalse(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306-not/usera/1412"));
    assert.isFalse(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-now-2306a-not/user/1412"));
    assert.isFalse(pattern.isValid("/canbeone/igor/should#+do-it/whata-smile-nowa-2306-not/user/1412"));
    assert.isTrue(pattern.isValid("/canbeone/igor/should#+do-it/whata1231-smile-now-2306-not/user/1412"));
    assert.isFalse(pattern.isValid("/canbeone/igor/should#+do-it/whata1231!-smile-now-2306-not/user/1412"));
    assert.isFalse(pattern.isValid("/canbeone/igor/should#+do-it/whata123-smile123-now-2306-not/user/1412"));
    assert.isFalse(pattern.isValid("/canbeone/igor/should--be-able-do-it/whata123-smile-now-2306-not/user/1412"));
    assert.isTrue(pattern.isValid("/can1454zfhg=?`='(    ()=(one/igor/should#+do-it/whata-smile-now-2306-not/user/1412"));
  });

  it("Should get correct parameters on /can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>" +
      "-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
    let url = "/can1454zfhg=?`='(    ()=(one/igor/should#+do-it/whata-smile-now-2306-not/user/1412";
    let params = pattern.getParams(url);
    assert.isTrue(isEqual(params, {
      any: "1454zfhg=?`='(    ()=(",
      id: "1412",
      name: "igor",
      nice: "smile",
      now: "#+",
      only: "2306",
      see: "whata"
    }));
    expect(pattern.createUrl(params)).to.be.eq(url);
  });

  it("Should test pattern for /assets/<file:(.*)>", () => {
    let pattern = RouteParser.parse("/assets/<file:(.*)>");
    assert.isFalse(pattern.isValid(""));
    assert.isTrue(pattern.isValid("/assets/css/main.css"));
  });

  it("Should get correct parameters on /assets/<file:(.*)>", () => {
    let pattern = RouteParser.parse("/assets/<file:(.*)>");
    let url = "/assets/css/main.css";
    let params = pattern.getParams(url);
    assert.isTrue(isEqual(params, {file: "css/main.css"}));
    expect(pattern.createUrl(params)).to.be.eq(url);
  });
});
