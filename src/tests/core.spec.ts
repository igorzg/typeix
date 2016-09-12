import {
  isString, isBoolean, isUndefined, isArray, isNull, isFunction, isDate, isRegExp, isObject,
  isPresent
} from "../core";
import {isNumber} from "util";
import {assert} from "chai";

describe("Core functions", () => {
  it("Should be valid string", () => {
    assert.isTrue(isString("value"));
    assert.isFalse(isString(null));
  });

  it("Should be valid boolean", () => {
    assert.isTrue(isBoolean(true));
    assert.isFalse(isBoolean(null));
  });

  it("Should be valid undefined", () => {
    assert.isTrue(isUndefined(undefined));
    assert.isFalse(isUndefined(true));
    assert.isFalse(isUndefined(null));
  });


  it("Should be valid number", () => {
    assert.isTrue(isNumber(1));
    assert.isTrue(isNumber(NaN));
    assert.isFalse(isNumber(undefined));
    assert.isFalse(isNumber(true));
    assert.isFalse(isNumber(null));
  });

  it("Should be valid array", () => {
    assert.isTrue(isArray([]));
    assert.isFalse(isArray({}));
    assert.isFalse(isArray(1));
    assert.isFalse(isArray(NaN));
    assert.isFalse(isArray(undefined));
    assert.isFalse(isArray(true));
    assert.isFalse(isArray(null));
  });

  it("Should be valid null", () => {
    assert.isFalse(isNull([]));
    assert.isFalse(isNull({}));
    assert.isFalse(isNull(1));
    assert.isFalse(isNull(NaN));
    assert.isFalse(isNull(undefined));
    assert.isFalse(isNull(true));
    assert.isTrue(isNull(null));
  });


  it("Should be valid function", () => {
    assert.isTrue(isFunction(Array));
    assert.isFalse(isFunction([]));
    assert.isFalse(isFunction({}));
    assert.isFalse(isFunction(1));
    assert.isFalse(isFunction(NaN));
    assert.isFalse(isFunction(undefined));
    assert.isFalse(isFunction(true));
    assert.isFalse(isFunction(null));
  });

  it("Should be valid date", () => {
    assert.isTrue(isDate(new Date));
    assert.isFalse(isDate([]));
    assert.isFalse(isDate({}));
    assert.isFalse(isDate(1));
    assert.isFalse(isDate(NaN));
    assert.isFalse(isDate(undefined));
    assert.isFalse(isDate(true));
    assert.isFalse(isDate(null));
  });

  it("Should be valid regex", () => {
    assert.isTrue(isRegExp(new RegExp("abc")));
    assert.isFalse(isRegExp([]));
    assert.isFalse(isRegExp({}));
    assert.isFalse(isRegExp(1));
    assert.isFalse(isRegExp(NaN));
    assert.isFalse(isRegExp(undefined));
    assert.isFalse(isRegExp(true));
    assert.isFalse(isRegExp(null));
  });

  it("Should be valid object", () => {
    assert.isTrue(isObject(new RegExp("abc")));
    assert.isTrue(isObject([]));
    assert.isTrue(isObject({}));
    assert.isFalse(isObject(1));
    assert.isFalse(isObject(NaN));
    assert.isFalse(isObject(undefined));
    assert.isFalse(isObject(true));
    assert.isFalse(isObject(null));
  });

  it("Should be present", () => {
    assert.isTrue(isPresent(new RegExp("abc")));
    assert.isTrue(isPresent([]));
    assert.isTrue(isPresent({}));
    assert.isTrue(isPresent(1));
    assert.isTrue(isPresent(NaN));
    assert.isFalse(isPresent(undefined));
    assert.isTrue(isPresent(true));
    assert.isFalse(isPresent(null));
  });

});
