import {isString, isBoolean, isUndefined, isArray, isNull, isFunction} from "../core";
import {isNumber} from "util";
/**
 * Created by igorzg on 9/8/2016.
 */

describe("core functions test", () => {
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

});
