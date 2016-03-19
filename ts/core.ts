/**
 * @since 1.0.0
 * @function
 * @name uuid
 * @description
 * Generate universally unique identifier
 * @return {String}
 * @example
 * uuid();
 */
export function uuid():string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		let r = Math.random() * 16 | 0;
		if (c === 'x') {
			return r.toString(16);
		}
		return (r & 0x3 | 0x8).toString(16);
	});
}

/**
 * @since 1.0.0
 * @function
 * @name isString
 * @description
 * Check if value is string
 * @return {Boolean}
 * @example
 * isString();
 */
export function isString(value: string): boolean {
	return typeof value === 'string';
}


/**
 * @since 1.0.0
 * @function
 * @name isBoolean
 * @description
 * Check if value is boolean
 * @return {Boolean}
 * @example
 * isBoolean();
 */
export function isBoolean(value: any): boolean {
	return typeof value === 'boolean';
}


/**
 * @since 1.0.0
 * @function
 * @name isUndefined
 * @description
 * Check if value is undefined
 * @return {Boolean}
 * @example
 * isString();
 */
export function isUndefined(value: any): boolean {
	return typeof value === 'undefined';
}

/**
 * @since 1.0.0
 * @function
 * @name isNumber
 * @description
 * Check if value is number
 * @return {Boolean}
 * @example
 * isNumber();
 */
export function isNumber(value: any): boolean {
	return typeof value === 'number' && !isNaN(value);
}

/**
 * @since 1.0.0
 * @function
 * @name isArray
 * @description
 * Check if value is array
 * @return {Boolean}
 * @example
 * isArray();
 */
export function isArray(value: any): boolean {
	return Array.isArray(value);
}

/**
 * @since 1.0.0
 * @function
 * @name isNull
 * @description
 * Check if value is null
 * @return {Boolean}
 * @example
 * isNull();
 */
export function isNull(value: any): boolean {
	return value === null;
}


/**
 * @since 1.0.0
 * @function
 * @name isFunction
 * @description
 * Check if value is function
 * @return {Boolean}
 * @example
 * isFunction();
 */
export function isFunction(value: any): boolean {
	return typeof value === 'function';
}


/**
 * @since 1.0.0
 * @function
 * @name isObject
 * @description
 * Check if value is object
 * @return {Boolean}
 * @example
 * isObject();
 */
export function isObject(value: any): boolean {
	return !isNull(value) && typeof value === 'object';
}


/**
 * @since 1.0.0
 * @function
 * @name isDate
 * @description
 * Check if value is Date object
 * @return {Boolean}
 * @example
 * isDate();
 */
export function isDate(value: any): boolean {
	return Object.prototype.toString.call(value) === '[object Date]';
}


/**
 * @since 1.0.0
 * @function
 * @name isRegExp
 * @description
 * Check if value is RegExp object
 * @return {Boolean}
 * @example
 * isRegExp();
 */
export function isRegExp(value: any): boolean {
	return Object.prototype.toString.call(value) === '[object RegExp]';
}