import {isFalsy, isObject, isPresent, isTruthy} from "../core";
import {IUrlTreePath} from "../interfaces/iroute";
import {Router} from "./router";

const IS_ANY_PATTERN = /<([^>]+)>/;
const PATTERN_MATCH = /<(\w+):([^>]+)>/g;
const HAS_GROUP_START = /^\(/;
const HAS_GROUP_END = /\)$/;
const PATH_START = /^\//;
const PATH = /\//;
const PATH_SPLIT = /\/([^><]+|<\w+:[^>]+>|\w+)\//;

/**
 * @since 1.0.0
 * @function
 * @name PatternChunk
 * @constructor
 *
 * @param {string} replace
 * @param {string} param
 * @param {number} index
 * @param {string} source
 *
 * @description
 * Pattern chunk used by pattern
 */
export class PatternChunk {
  private regex: RegExp;

  constructor(private index: number,
              private replace: string,
              private source: string,
              private param?: string) {
    this.regex = new RegExp("^" + source + "$");
  }

  /**
   * @since 1.0.0
   * @function
   * @name PatternChunk#getRegex
   *
   * @description
   * Get regex from source
   */
  getRegex(): RegExp {
    return this.regex;
  }

  /**
   * @since 1.0.0
   * @function
   * @name PatternChunk#getIndex
   *
   * @description
   * Get index
   */
  getIndex(): number {
    return this.index;
  }

  /**
   * @since 1.0.0
   * @function
   * @name PatternChunk#getReplaceMatcher
   *
   * @description
   * Get replace matcher
   */
  getReplaceMatcher(): string {
    return this.replace;
  }

  /**
   * @since 1.0.0
   * @function
   * @name PatternChunk#getSource
   *
   * @description
   * Get source
   */
  getSource(): string {
    return this.source;
  }

  /**
   * @since 1.0.0
   * @function
   * @name PatternChunk#getParam
   *
   * @description
   * Get parameter
   */
  getParam(): string {
    return this.param;
  }
}

/**
 * @since 1.0.0
 * @function
 * @name Pattern
 * @constructor
 *
 * @param {path} path
 * @param {regex} replace
 * @param {chunks} param
 *
 * @description
 * Route match pattern
 */
export class Pattern {
  constructor(private path: string,
              private source: string,
              private regex: RegExp,
              private chunks: Array<PatternChunk>) {
  }

  /**
   * @since 1.0.0
   * @function
   * @name Pattern#normalizePath
   *
   * @description
   * Creates path from chunks throws error if no param is correct data type or if it dosen't exist
   *
   * @throws Error
   */
  normalizePath(params: Object): string {
    let path = this.path;
    this.chunks.forEach(chunk => {
      if (!params.hasOwnProperty(chunk.getParam())) {
        throw new Error(`Param ${chunk.getParam()} is missing in parameters provided!`);
      }
      let param = params[chunk.getParam()];
      if (!chunk.getRegex().test(param)) {
        throw new TypeError(`Param ${chunk.getParam()} is not valid type, provided value: "${param}" 
        is tested with regex: ${chunk.getSource()}`);
      }
      path = path.replace(chunk.getReplaceMatcher(), param);
    });
    return path;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Pattern#getSource
   *
   * @description
   * Get source pattern
   */
  getSource(): string {
    return this.source;
  }

  /**
   * @since 1.0.0
   * @function
   * @name Pattern#getChunks
   *
   * @description
   * Get array chunks
   */
  getChunks(): Array<PatternChunk> {
    return this.chunks;
  }
}

/**
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
  pattern: Pattern;
  child: RouteParser;
  parent: RouteParser;

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser#toPattern
   * @param {String} path
   * @static
   *
   * @description
   * Creates pattern based on path provided
   * @example
   * RouteParser.toPattern("<param_a:(\\w+)>-<param_b:([a-zA-Z]+)>-now-<param_c:\\d+>-not");
   */
  static toPattern(path: string): Pattern {
    let patterns = [];
    let pattern = null;
    /**
     * Parse patterns
     */
    if (PATTERN_MATCH.test(path)) {
      pattern = path.replace(PATTERN_MATCH, (replace, key, source, index) => {
        if (!HAS_GROUP_START.test(source) || !HAS_GROUP_END.test(source)) {
          source = "(" + source + ")";
        }
        patterns.push(
          new PatternChunk(
            index,
            replace,
            source,
            key
          )
        );
        return source;
      });
    } else if (IS_ANY_PATTERN.test(path)) {
      pattern = path.replace(IS_ANY_PATTERN, (replace, key, index) => {
        let source = "([\\s\\S]+)";
        patterns.push(
          new PatternChunk(
            index,
            replace,
            source,
            key
          )
        );
        return source;
      });
    } else if (path === "*") {
      pattern = "([\\s\\S]+)";
    } else {
      pattern = path;
    }
    return new Pattern(path, pattern, new RegExp("^" + pattern + "$"), patterns);
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser#parse
   * @param {String} url
   * @static
   *
   * @description
   * Creates url tree which is used by RouteParser for easier pattern creation
   *
   * @example
   * RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");
   *
   */
  static parse(url: string): RouteParser {
    let chunks = url.split(PATH_SPLIT).filter(isTruthy);
    if (isFalsy(url) || ["/", "*"].indexOf(url.charAt(0)) === -1) {
      throw new Error("Url must start with \/ or it has to be * which match all patterns");
    } else if (chunks.length > 1) {
      let tree: any = chunks.reduceRight((cTree: any, currentValue: any) => {
        let obj: any = {
          child: null,
          path: currentValue
        };
        if (isPresent(cTree)) {
          obj.child = isObject(cTree) ? cTree : {child: null, path: cTree};
        }
        return obj;
      });
      return new RouteParser(tree);
    }
    return new RouteParser({
      child: null,
      path: url
    });
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser
   * @param {IUrlTreePath} tree
   * @param {RouteParser} parent
   * @constructor
   *
   * @description
   * Creates pattern based on path provided
   * @example
   * let tree = RouteParser.toUrlTree("/<param_a:(\\w+)>-<param_b:([a-zA-Z]+)>-now-<param_c:\\d+>-not/bcd");
   * let parsedRoute = new RouteParser(tree);
   */
  constructor(tree: IUrlTreePath, parent?: RouteParser) {
    this.path = tree.path;
    if (isPresent(parent)) {
      this.parent = parent;
    }
    if (isPresent(tree.child)) {
      this.child = new RouteParser(tree.child, this);
    }
    this.pattern = RouteParser.toPattern(this.path);
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser#isValid
   * @param {String} url
   * @description
   * Check if url is valid
   */
  isValid(url: string): boolean {
    let pattern = this.getPattern();
    let regex = new RegExp("^" + pattern + "$");
    return regex.test(url);
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser#createUrl
   * @param {Object} params
   * @description
   * Create url if params are correct type if params are not valid it throws error
   * @throws Error
   */
  createUrl(params: Object): string {
    let head = this.getHead();
    let url = "";
    while (isPresent(head)) {
      let path = head.pattern.normalizePath(params);
      if (isTruthy(path)) {
        url += Router.prefixSlash(path);
      }
      head = head.child;
    }
    return url;
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser#getParams
   * @param {String} url
   * @description
   * Extract params from url
   * @throws Error
   */
  getParams(url: string): Object {
    let data = {};
    let pattern = this.getPattern();
    if (!this.isValid(url)) {
      throw new Error(`Url ${url} is not matching current pattern!`);
    }
    let chunks = url.match(pattern).slice(1);
    this.toChunksArray().forEach((item, index) => data[item.getParam()] = chunks[index]);
    return data;
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser#toArray
   * @description
   * Convert parser tree to array
   */
  toChunksArray(): Array<PatternChunk> {
    let data: Array<PatternChunk> = [];
    let chunk = this.getHead();
    while (isTruthy(chunk)) {
      data = data.concat(chunk.pattern.getChunks());
      chunk = chunk.child;
    }
    return data;
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser#getPattern
   * @description
   * Get route pattern
   */
  private getPattern(): string {
    let pattern = "";
    let chunk = this.getHead();
    while (isTruthy(chunk)) {
      let source = chunk.pattern.getSource();
      if (PATH_START.test(source)) {
        pattern = source;
      } else {
        pattern += PATH.source + source;
      }
      chunk = chunk.child;
    }
    return pattern;
  }

  /**
   * @since 1.0.0
   * @function
   * @name RouteParser#getHead
   * @return {RouteParser}
   * @private
   *
   * @description
   * Return head RouteParser
   *
   */
  private getHead() {
    if (isPresent(this.parent)) {
      return this.parent.getHead();
    }
    return this;
  }
}
