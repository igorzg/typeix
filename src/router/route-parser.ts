import {isPresent, isTruthy, isObject} from "../core";
const IS_ANY_PATTERN = /<([^>]+)>/;
const PATTERN_MATCH = /<(\w+):([^>]+)>/g;
const HAS_GROUP = /^\(([^\)]+)\)$/;
const URL_SPLIT = (/\/([^\/]+)\//g;

export interface IUrlTreePath {
  child?: IUrlTreePath;
  path: string;
}
/**
 * RouteParser
 */
export class RouteParser {
  url: string;
  pattern: any;
  child: RouteParser;
  parent: RouteParser;

  constructor(url: string) {

  }

  /**
   * Convert url paths to url three
   * @param url
   * @returns {string[]}
   */
  static toUrlThree(url: string): any {
    return url.split(URL_SPLIT).filter(isTruthy).reduceRight((cTree: any, currentValue: any) => {
      let three: any = {
        child: null,
        path: currentValue
      };
      if (isPresent(cTree)) {
        three.child = isObject(cTree) ? cTree : {child: null, path: cTree};
      }
      return three;
    });
  }

  /**
   * Parse url string
   * @param url
   */
  static parse(url: string) {
    let three = RouteParser.splitToPaths(url);

  }
}
