/**
 * Create unique id
 *
 * @returns {string}
 */
export function uuid(): string {
  let d = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function toString
 *
 * @description
 * Try to serialize object
 */
export function toString(value): string {
  try {
    return JSON.stringify(value);
  } catch (e) {
    return value.toString();
  }
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isBoolean
 *
 * @description
 * Check if value is boolean
 */
export function isBoolean(value): boolean {
  return typeof value === "boolean";
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isUndefined
 *
 * @description
 * Check if value is un-defined
 */
export function isUndefined(value): boolean {
  return typeof value === "undefined";
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isString
 *
 * @description
 * Check if value is string
 */
export function isString(value): boolean {
  return typeof value === "string";
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isNumber
 *
 * @description
 * Check if value is isNumber
 */
export function isNumber(value): boolean {
  return typeof value === "number" && !isNaN(value);
}

/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isArray
 *
 * @description
 * Check if value is array
 */
export function isArray(value): boolean {
  return Array.isArray(value);
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isNull
 *
 * @description
 * Check if value is funciton
 */
export function isNull(value): boolean {
  return value === null;
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isFunction
 *
 * @description
 * Check if value is funciton
 */
export function isFunction(value): boolean {
  return typeof value === "function";
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isArray
 *
 * @description
 * Check if value is array
 */
export function isDate(value): boolean {
  return Object.prototype.toString.call(value) === "[object Date]";
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isRegExp
 *
 * @description
 * Check if object is an regular expression
 */
export function isRegExp(value): boolean {
  return Object.prototype.toString.call(value) === "[object RegExp]";
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isObject
 *
 * @description
 * Check if value is object
 */
export function isObject(value): boolean {
  return !isNull(value) && typeof value === "object";
}

/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isPresent
 *
 * @description
 * Check if value is object
 */
export function isPresent(value): boolean {
  return !isNull(value) && !isUndefined(value);
}

/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isTruthy
 *
 * @description
 * we are doing data type conversion to see if value is considered true value
 */
export function isTruthy(value): boolean {
  return !!value;
}

/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isFalsy
 *
 * @description
 * we are doing data type conversion to see if value is considered false value
 */
export function isFalsy(value): boolean {
  return !value;
}

/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isClass
 *
 * @description
 * Check if type is class
 */
export function isClass(value): boolean {
  return isFunction(value) && /^\s*class\s+/.test(value.toString());
}
/**
 * @since 1.0.0
 * @author Igor Ivanovic
 * @function isEqual
 *
 * @description
 * Check if two objects are equal
 */
export function isEqual(a, b): boolean {
  if (isString(a)) {
    return a === b;
  } else if (_isNumber(a)) {
    if (isNaN(a) || isNaN(b)) {
      return isNaN(a) === isNaN(b);
    }
    return a === b;
  } else if (isBoolean(a)) {
    return a === b;
  } else if (isDate(a)) {
    return a.getTime() === b.getTime();
  } else if (isRegExp(a)) {
    return a.source === b.source;
  } else if (isArray(a) && isArray(b)) {

    // check references first
    if (a === b) {
      return true;
    } else if (a.constructor.name !== b.constructor.name) {
      return false;
    } else if (a.length === 0 && b.length === 0) {
      return true;
    }

    try {
      if (a.length !== b.length) {
        return false;
      }
      return a.every((item, index) => isEqual(item, b[index]));
    } catch (e) {
      throw e;
    }
  } else if (isObject(a) && isObject(b)) {
    let equal: Array<boolean> = [];
    let aLen = Object.keys(a).length;
    let bLen = Object.keys(b).length;
    // check references first

    if (a === b) {
      return true;
    } else if (a.constructor.name !== b.constructor.name) {
      return false;
    } else if (aLen === 0 && bLen === 0) {
      return true;
    }

    try {
      if (aLen === bLen) {
        Object.keys(a).forEach(key => equal.push(isEqual(a[key], b[key])));
      }
    } catch (e) {
      throw e;
    }

    if (equal.length === 0) {
      return false;
    }
    return equal.every((item) => item === true);
    /// compare undefined and nulls
  } else if (a === b) {
    return true;
  }

  return false;
}

/**
 * Internal is number
 * @param value
 * @returns {boolean}
 * @private
 */
function _isNumber(value): boolean {
  return typeof value === "number";
}
