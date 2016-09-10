import {isPresent, isTruthy, isObject} from "../core";
const IS_ANY_PATTERN = /<([^>]+)>/;
const PATTERN_MATCH = /<(\w+):([^>]+)>/g;
const HAS_GROUP = /^\(([^\)]+)\)$/;
const URL_SPLIT = /\/([^\/]+)\//g;
const PATH_MATCH = /\//g

export interface IUrlTreePath {
  child?: IUrlTreePath;
  path: string;
}
/**
 * @license Mit Licence 2016
 * @since 1.0.0
 * @function
 * @name Pattern
 * @constructor
 *
 * @param {RegExp} pattern
 * @param {string} replace
 * @param {string} param
 * @param {number} index
 * @param {string} source
 *
 * @description
 * Pattern mapping
 */
export class Pattern {
  constructor(private pattern: RegExp,
              private index: number,
              private replace: string,
              private source: string,
              private param?: string) {
  }
}
/**
 * @license Mit Licence 2016
 * @since 1.0.0
 * @function
 * @name RouteParser
 * @constructor
 *
 * @param {IUrlTreePath} tree
 *
 * @description
 * RouteParser is responsible for parsing routes
 */
export class RouteParser {

  path: string;
  patterns: Array<Pattern>;
  child: RouteParser;
  parent: RouteParser;

  /**
   * Create patterns
   * @param path
   * @returns {Array}
   */
  static toPattern(path: string): Array<Pattern> {
    let patterns = [];
    /**
     * Check if path contains path char
     */
    if (PATH_MATCH.test(path)) {
      throw new Error(`Path ${path} must be normalised`);
    }
    /**
     * Parse patterns
     */
    if (PATTERN_MATCH.test(path)) {
      path.replace(PATTERN_MATCH, (replace, key, source, index) => {
        if (!HAS_GROUP.test(source)) {
          source = "(" + source + ")";
        }
        patterns.push(
          new Pattern(
            new RegExp("^" + source + "$"),
            index,
            replace,
            source,
            key
          )
        );
        return null;
      });
    } else if (IS_ANY_PATTERN.test(path)) {
      path.replace(IS_ANY_PATTERN, (replace, key, index) => {
        let source = "([\\s\\S]+)";
        patterns.push(
          new Pattern(
            new RegExp("^" + source + "$"),
            index,
            replace,
            source,
            key
          )
        );
        return null;
      });
    } else {
      patterns.push(
        new Pattern(
          new RegExp("^" + path + "$"),
          0,
          path,
          path,
          null
        )
      );
    }
    return patterns;
  }

  /**
   * Convert url paths to url three
   * @param url
   * @returns {string[]}
   */
  static toUrlTree(url: string): any {
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
   * Constructor
   * @param tree
   */
  constructor(tree: IUrlTreePath) {
    this.path = tree.path;
    if (isPresent(tree.child)) {
      this.child = new RouteParser(tree.child);
      this.child.parent = this;
    }
    this.patterns = RouteParser.toPattern(this.path);
  }

  /**
   * Cleanup
   */
  destroy() {
    if (isPresent(this.child)) {
      this.child.destroy();
      this.child = null;
    }
    this.parent = null;
    this.patterns = null;
  }

}
