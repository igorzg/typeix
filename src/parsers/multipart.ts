import {IBodyParser} from "../interfaces/ibodyparser";
import {HttpError} from "../error";
import {isEqual, isFalsy} from "../core";

const START = 0;
const START_BOUNDARY = 1;
const HEADER_FIELD_START = 2;
const HEADER_FIELD = 3;
const HEADER_VALUE_START = 4;
const HEADER_VALUE = 5;
const HEADER_VALUE_ALMOST_DONE = 6;
const HEADERS_ALMOST_DONE = 7;
const PART_DATA_START = 8;
const PART_DATA = 9;
const PART_END = 10;
const CLOSE_BOUNDARY = 11;
const END = 12;

const LF = 10;
const CR = 13;
const SPACE = 32;
const HYPHEN = 45;
const COLON = 58;
const A = 97;
const Z = 122;

const CONTENT_TYPE_RE = /^multipart\/(?:form-data|related)(?:;|$)/i;
const CONTENT_TYPE_PARAM_RE = /;\s*([^=]+)=(?:"([^"]+)"|([^;]+))/gi;
const FILE_EXT_RE = /(\.[_\-a-zA-Z0-9]{0,16}).*/;
const LAST_BOUNDARY_SUFFIX_LEN = 4; // --\r\n

/**
 * @since 1.0.0
 * @function
 * @name MultiPart
 *
 * @description
 * Multi part body parser
 */
export class MultiPart implements IBodyParser {

  private boundary: string;
  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#constructor
   * @param {string} contentType
   *
   * @description
   * Multi part constructor
   */
  constructor(public contentType: string) {

    if (isFalsy(contentType)) {
      throw new HttpError(500, "Missing content type header", contentType);
    }

    let match = CONTENT_TYPE_RE.exec(contentType);

    if (isFalsy(match)) {
      throw new HttpError(415, "Unsupported content-type", contentType);
    }

    CONTENT_TYPE_PARAM_RE.lastIndex = match.index + match[0].length - 1;

    while ((match = CONTENT_TYPE_PARAM_RE.exec(contentType))) {
      if (!isEqual(match[1].toLowerCase(), "boundary")) {
        continue;
      }
      this.boundary = match[2] || match[3];
      break;
    }

    if (isFalsy(this.boundary)) {
      throw new HttpError(400, "Content-type missing boundary", contentType);
    }

  }
  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#parse
   * @param {Buffer} content
   *
   * @description
   * Parse multipart buffer and return structured data
   */
  parse(content: Buffer) {
    return null;
  }

}
