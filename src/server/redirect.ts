import {isEqual} from "../core";
/**
 * @since 1.0.0
 * @interface
 * @name Redirect
 * @description
 * Redirect enums
 */
export interface IRedirect {
  url: string;
  code: Redirect;
}
/**
 * @since 1.0.0
 * @enum
 * @name Redirect
 * @description
 * Redirect enums
 */
export enum Redirect {
  MULTIPLE_CHOICES,
  MOVED_PERMANENTLY,
  FOUND,
  SEE_OTHER,
  NOT_MODIFIED,
  USE_PROXY,
  SWITCH_PROXY,
  TEMPORARY_REDIRECT,
  PERMANENT_REDIRECT
}

/**
 * @since 1.0.0
 * @function
 * @name getRedirectCode
 * @description
 * Get status codes from redirect default one is TEMPORARY_REDIRECT
 *
 * @private
 */
export function getRedirectCode(code: Redirect): number {
  if (isEqual(code, Redirect.MULTIPLE_CHOICES)) {
    return 300;
  } else if (isEqual(code, Redirect.MOVED_PERMANENTLY)) {
    return 301;
  } else if (isEqual(code, Redirect.FOUND)) {
    return 302;
  } else if (isEqual(code, Redirect.SEE_OTHER)) {
    return 303;
  } else if (isEqual(code, Redirect.NOT_MODIFIED)) {
    return 304;
  } else if (isEqual(code, Redirect.USE_PROXY)) {
    return 305;
  } else if (isEqual(code, Redirect.SWITCH_PROXY)) {
    return 306;
  } else if (isEqual(code, Redirect.TEMPORARY_REDIRECT)) {
    return 307;
  } else if (isEqual(code, Redirect.PERMANENT_REDIRECT)) {
    return 308;
  }
  return 307;
}
