import {RouteParser} from "../router/route-parser";
import {assert, expect} from "chai";
import {isEqual} from "../core";

describe("RouterParser", () => {

  it("Initialize", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>" +
      "-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
    assert.isTrue(pattern instanceof RouteParser);
  });

  it("Should test patterns on /can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>", () => {
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

    let params = pattern.getParams("/can1454zfhg=?`='(    ()=(one/igor/should#+do-it/whata-smile-now-2306-not/user/1412");
    assert.isTrue(isEqual(params, {
      "any": "1454zfhg=?`='(    ()=(",
      "name": "igor",
      "now": "#+",
      "see": "whata",
      "nice": "smile",
      "only": "2306",
      "id": "1412"
    }));

    expect(pattern.createUrl(params)).to.be.eq("/can1454zfhg=?`='(    ()=(one/igor/should#+do-it/whata-smile-now-2306-not/user/1412");
  });


  it("Should test patterns on /can<any>one/<name:\\w+>/should<now:[\\w\\W\\/]+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:[\\w\\W\\/]+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");

    let params = pattern.getParams("/can1454zfhg=?`='(    ()=(one/igor/should#+do-it/whata-smile-now-2306-not/user/1412");
    assert.isTrue(isEqual(params, {
      "any": "1454zfhg=?`='(    ()=(",
      "name": "igor",
      "now": "#+",
      "see": "whata",
      "nice": "smile",
      "only": "2306",
      "id": "1412"
    }));

    expect(pattern.createUrl(params)).to.be.eq("/can1454zfhg=?`='(    ()=(one/igor/should#+do-it/whata-smile-now-2306-not/user/1412");

    let params1 = pattern.getParams("/can1454zfhg=?`='(    ()=(one/igor/should#+abc/next-toitdo-it/whata-smile-now-2306-not/user/1412");
    assert.isTrue(isEqual(params1, {
      "any": "1454zfhg=?`='(    ()=(",
      "name": "igor",
      "now": "#+abc/next-toit",
      "see": "whata",
      "nice": "smile",
      "only": "2306",
      "id": "1412"
    }));

    expect(pattern.createUrl(params1)).to.be.eq("/can1454zfhg=?`='(    ()=(one/igor/should#+abc/next-toitdo-it/whata-smile-now-2306-not/user/1412");
  });


  it("Should test patterns on /can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>", () => {
    let pattern = RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>");
    assert.isFalse(pattern.isValid(""));
    assert.isTrue(pattern.isValid("/canbeone/igor/should#+do-it/whata"));
    assert.isTrue(pattern.isValid("/canbeone/cn/should#+do-it/all"));
    assert.isTrue(pattern.isValid("/canbeone/ws/should#+do-it/good"));
    let params = pattern.getParams("/canbeone/ws/should#+do-it/good");
    assert.isTrue(isEqual(params, {
      "any": "be",
      "name": "ws",
      "now": "#+",
      "see": "good"
    }));

    expect(pattern.createUrl(params)).to.be.eq("/canbeone/ws/should#+do-it/good");
  });

  it("Should test patterns on /<clientId:(\\w+)>/<url:([\\w-]+)>", () => {
    let pattern = RouteParser.parse("/<clientId:(\\w+)>/<url:([\\w-]+)>");
    assert.isFalse(pattern.isValid("/category/1/page/1"));
    assert.isFalse(pattern.isValid("/category/abc1/abc"));
    assert.isTrue(pattern.isValid("/category/abc1"));
    let params = pattern.getParams("/category/abc1");
    assert.isTrue(isEqual(params, {
      "clientId": "category",
      "url": "abc1"
    }));
  });


  it("Should test patterns on /home", () => {
    let pattern = RouteParser.parse("/home");
    assert.isTrue(pattern.isValid("/home"));
    let params = pattern.getParams("/home");
    assert.isTrue(isEqual(params, {}));
  });


  it("Should test patterns on /home/test", () => {
    let pattern = RouteParser.parse("/home/test");
    assert.isTrue(pattern.isValid("/home/test"));
    let params = pattern.getParams("/home/test");
    assert.isTrue(isEqual(params, {}));
  });


  it("Should test patterns on /home/test/abc", () => {
    let pattern = RouteParser.parse("/home/test/abc");
    assert.isTrue(pattern.isValid("/home/test/abc"));
    let params = pattern.getParams("/home/test/abc");
    assert.isTrue(isEqual(params, {}));
  });



  it("Should test patterns on /category/<category:(\\d+)>/page/<pagenumber:(\\d+)>", () => {
    let pattern = RouteParser.parse("/category/<category:(\\d+)>/page/<pagenumber:(\\d+)>");
    assert.isTrue(pattern.isValid("/category/1/page/1"));
    assert.isFalse(pattern.isValid("/category/abc1/abc"));
    assert.isFalse(pattern.isValid("/category/abc1"));
    let params = pattern.getParams("/category/1/page/1");
    assert.isTrue(isEqual(params, {
      "category": "1",
      "pagenumber": "1"
    }));
  });

  it("Should test patterns on /<category:(.*)>/page/<pageNum:(.*)>", () => {
    let pattern = RouteParser.parse("/<category:(.*)>/page/<pageNum:(.*)>");
    assert.isTrue(pattern.isValid("/category/page/1"));
    assert.isTrue(pattern.isValid("/category/page/1/abc"));
    assert.isTrue(pattern.isValid("/category/value/page/1/abc"));
    assert.isFalse(pattern.isValid("/category/value/page1/1/abc"));
    assert.isFalse(pattern.isValid("/category/page1/1/abc"));
    let params = pattern.getParams("/category/value/page/1/abc");
    let params1 = pattern.getParams("/category/page/1");

    assert.isTrue(isEqual(params, {
      "category": "category/value",
      "pageNum": "1/abc"
    }));

    expect(pattern.createUrl(params)).to.be.eq("/category/value/page/1/abc");

    assert.isTrue(isEqual(params1, {
      "category": "category",
      "pageNum": "1"
    }));

    expect(pattern.createUrl(params1)).to.be.eq("/category/page/1");
  });


  it("Should test patterns on /home/<id:(\\d+)>", () => {
    let pattern = RouteParser.parse("/home/<id:(\\d+)>");
    assert.isFalse(pattern.isValid(""));
    assert.isTrue(pattern.isValid("/home/123"));
    assert.isFalse(pattern.isValid("/home/123/"));
    assert.isFalse(pattern.isValid("/home/cn/all"));
    assert.isFalse(pattern.isValid("/home/abc"));
    assert.isFalse(pattern.isValid("/home/abc/"));
    assert.isTrue(pattern.isValid("/home/1"));
    let params = pattern.getParams("/home/123");
    assert.isTrue(isEqual(params, {
      "id": "123"
    }));
  });

  it("Should test patterns on /home/<name:(\\w+)>", () => {
    let pattern = RouteParser.parse("/home/<name:(\\w+)>");
    assert.isFalse(pattern.isValid(""));
    assert.isTrue(pattern.isValid("/home/123"));
    assert.isTrue(pattern.isValid("/home/works"));
    assert.isFalse(pattern.isValid("/home/123/"));
    assert.isFalse(pattern.isValid("/home/cn/all"));
    assert.isTrue(pattern.isValid("/home/abc"));
    assert.isFalse(pattern.isValid("/home/abc/"));
    assert.isTrue(pattern.isValid("/home/1"));
    let params = pattern.getParams("/home/123");
    assert.isTrue(isEqual(params, {
      "name": "123"
    }));
  });


  it("Should test patterns on /", () => {
    let pattern = RouteParser.parse("/");
    assert.isTrue(pattern.isValid("/"));
    assert.isFalse(pattern.isValid(""));
    assert.throw(() => RouteParser.parse(""), "Url must start with \/");
    assert.throw(() => RouteParser.parse("abc/"), "Url must start with \/");
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
    let url = "/assets/css/main.css";
    assert.isTrue(pattern.isValid(url));
    assert.isFalse(pattern.isValid(""));
    assert.isTrue(pattern.isValid("/assets/css/main.css"));

    let params = pattern.getParams("/assets/css/main.css");

    assert.isTrue(isEqual(params, {
      "file": "css/main.css"
    }));
  });

  it("Should test patterns on /<clientId:(\\w+)>/<url:([\\w-]+\\/[\\w-]+)>/page/<number:(\\d+)>", () => {
    let pattern = RouteParser.parse("/<clientId:(\\w+)>/<url:([\\w-]+\\/[\\w-]+)>/page/<number:(\\d+)>");
    assert.isTrue(pattern.isValid("/ab123sbr/this-is-test/abc-123/page/123123"));
    let params = pattern.getParams("/ab123sbr/this-is-test/abc-123/page/123123");
    assert.isTrue(isEqual(params, {
      "clientId": "ab123sbr",
      "url": "this-is-test/abc-123",
      "number": "123123"
    }));
  });


  it("Should get correct parameters on /assets/<file:(.*)>", () => {
    let pattern = RouteParser.parse("/assets/<file:(.*)>");
    let url = "/assets/css/main.css";
    assert.isTrue(pattern.isValid(url));
    let params = pattern.getParams(url);
    assert.isTrue(isEqual(params, {file: "css/main.css"}));
    expect(pattern.createUrl(params)).to.be.eq(url);
  });
});
