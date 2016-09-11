import {
  isString, isBoolean, isUndefined, isArray, isNull, isFunction, isDate, isRegExp, isObject,
  isPresent
} from "../core";
import {isNumber} from "util";

describe("Core functions", () => {
  it("Should be valid string", () => {
    expect(isString("value")).toBeTruthy();
    expect(isString(null)).toBeFalsy();
  });

  it("Should be valid boolean", () => {
    expect(isBoolean(true)).toBeTruthy();
    expect(isBoolean(null)).toBeFalsy();
  });

  it("Should be valid undefined", () => {
    expect(isUndefined(undefined)).toBeTruthy();
    expect(isUndefined(true)).toBeFalsy();
    expect(isUndefined(null)).toBeFalsy();
  });


  it("Should be valid number", () => {
    expect(isNumber(1)).toBeTruthy();
    expect(isNumber(NaN)).toBeTruthy();
    expect(isNumber(undefined)).toBeFalsy();
    expect(isNumber(true)).toBeFalsy();
    expect(isNumber(null)).toBeFalsy();
  });

  it("Should be valid array", () => {
    expect(isArray([])).toBeTruthy();
    expect(isArray({})).toBeFalsy();
    expect(isArray(1)).toBeFalsy();
    expect(isArray(NaN)).toBeFalsy();
    expect(isArray(undefined)).toBeFalsy();
    expect(isArray(true)).toBeFalsy();
    expect(isArray(null)).toBeFalsy();
  });

  it("Should be valid null", () => {
    expect(isNull([])).toBeFalsy();
    expect(isNull({})).toBeFalsy();
    expect(isNull(1)).toBeFalsy();
    expect(isNull(NaN)).toBeFalsy();
    expect(isNull(undefined)).toBeFalsy();
    expect(isNull(true)).toBeFalsy();
    expect(isNull(null)).toBeTruthy();
  });


  it("Should be valid function", () => {
    expect(isFunction(Array)).toBeTruthy();
    expect(isFunction([])).toBeFalsy();
    expect(isFunction({})).toBeFalsy();
    expect(isFunction(1)).toBeFalsy();
    expect(isFunction(NaN)).toBeFalsy();
    expect(isFunction(undefined)).toBeFalsy();
    expect(isFunction(true)).toBeFalsy();
    expect(isFunction(null)).toBeFalsy();
  });

  it("Should be valid date", () => {
    expect(isDate(new Date)).toBeTruthy();
    expect(isDate([])).toBeFalsy();
    expect(isDate({})).toBeFalsy();
    expect(isDate(1)).toBeFalsy();
    expect(isDate(NaN)).toBeFalsy();
    expect(isDate(undefined)).toBeFalsy();
    expect(isDate(true)).toBeFalsy();
    expect(isDate(null)).toBeFalsy();
  });

  it("Should be valid regex", () => {
    expect(isRegExp(new RegExp("abc"))).toBeTruthy();
    expect(isRegExp([])).toBeFalsy();
    expect(isRegExp({})).toBeFalsy();
    expect(isRegExp(1)).toBeFalsy();
    expect(isRegExp(NaN)).toBeFalsy();
    expect(isRegExp(undefined)).toBeFalsy();
    expect(isRegExp(true)).toBeFalsy();
    expect(isRegExp(null)).toBeFalsy();
  });

  it("Should be valid object", () => {
    expect(isObject(new RegExp("abc"))).toBeTruthy();
    expect(isObject([])).toBeTruthy();
    expect(isObject({})).toBeTruthy();
    expect(isObject(1)).toBeFalsy();
    expect(isObject(NaN)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject(true)).toBeFalsy();
    expect(isObject(null)).toBeFalsy();
  });

  it("Should be present", () => {
    expect(isPresent(new RegExp("abc"))).toBeTruthy();
    expect(isPresent([])).toBeTruthy();
    expect(isPresent({})).toBeTruthy();
    expect(isPresent(1)).toBeTruthy();
    expect(isPresent(NaN)).toBeTruthy();
    expect(isPresent(undefined)).toBeFalsy();
    expect(isPresent(true)).toBeTruthy();
    expect(isPresent(null)).toBeFalsy();
  });

});
