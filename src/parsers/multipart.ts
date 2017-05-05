import {IBodyParser} from "../interfaces/ibodyparser";
import {HttpError} from "../error";
import {isEqual, isFalsy, isTruthy} from "../core";
import {NodeStringDecoder, StringDecoder} from "string_decoder";

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

/**
 * @since 1.0.0
 * @function
 * @name MultiPartField
 *
 * @description
 * Parsed multi part field
 */
export class MultiPartField {
  constructor(private fieldName: string,
              private fieldValue: string,
              private encoding: string,
              private buffer: Buffer) {
  }

  getFieldName() {
    return this.fieldName;
  }

  getFieldValue() {
    return this.fieldValue;
  }

  getEncoding() {
    return this.encoding;
  }

  getBuffer() {
    return this.buffer;
  }
}
/**
 * @since 1.0.0
 * @function
 * @name MultiPartFile
 *
 * @description
 * Parsed multi part file
 */
export class MultiPartFile {
  constructor(private fieldName: string,
              private fileName: string,
              private encoding: string,
              private buffer: Buffer) {
  }

  getFieldName() {
    return this.fieldName;
  }

  getFileName() {
    return this.fileName;
  }

  getEncoding() {
    return this.encoding;
  }

  getBuffer() {
    return this.buffer;
  }
}

/**
 * @since 1.0.0
 * @function
 * @name MultiPart
 *
 * @description
 * Multi part body parser
 */
export class MultiPart implements IBodyParser {

  private partBoundaryFlag = false;
  private boundaryChars: any = {};
  private state: number = START;
  private headerFieldDecoder: NodeStringDecoder;
  private headerValueDecoder: NodeStringDecoder;
  private partHeaders: any = {};
  private encoding;

  private boundaryLength: number;
  private boundary: Buffer;
  private lookBehind: Buffer;

  private partTransferEncoding: string;

  private partName: string;
  private partFileName: string;
  private partFileBufferList: Array<Buffer> = [];
  private headerField: string;
  private headerValue: string;

  private headerFieldMark: number;
  private headerValueMark: number;
  private partDataMark: number;
  private partData: Array<MultiPartField | MultiPartFile> = [];

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#constructor
   * @param {string} contentType
   * @param {string} encoding
   *
   * @description
   * Multi part constructor
   */
  constructor(public contentType: string, encoding = "utf8") {


    if (isFalsy(contentType)) {
      throw new HttpError(500, "Missing content type header", contentType);
    }

    let match = CONTENT_TYPE_RE.exec(contentType);

    if (isFalsy(match)) {
      throw new HttpError(415, "Unsupported content-type", contentType);
    }

    let boundary: string;

    CONTENT_TYPE_PARAM_RE.lastIndex = match.index + match[0].length - 1;

    while ((match = CONTENT_TYPE_PARAM_RE.exec(contentType))) {
      if (!isEqual(match[1].toLowerCase(), "boundary")) {
        continue;
      }
      boundary = match[2] || match[3];
      break;
    }

    if (isFalsy(boundary)) {
      throw new HttpError(400, "Content-type missing boundary", contentType);
    }

    this.encoding = encoding;
    this.boundary = new Buffer(boundary.length + 4);
    this.boundary.write("\r\n--'", 0, boundary.length + 4, "ascii");
    this.boundary.write(boundary, 4, boundary.length, "ascii");
    this.lookBehind = new Buffer(this.boundary.length + 8);
    this.boundaryLength = this.boundary.length;
    for (let i = 0; i < this.boundaryLength; i++) {
      this.boundaryChars[this.boundary[i]] = true;
    }
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#parse
   * @param {Buffer} buffer
   *
   * @description
   * Parse multipart buffer and return structured data
   */
  parse(buffer: Buffer): Array<MultiPartField | MultiPartFile> {

    let i, c, cl, index, prevIndex, len = buffer.length, boundaryEnd = this.boundaryLength - 1;

    for (i = 0; i < len; i++) {
      c = buffer[i];
      switch (this.state) {
        case START:
          index = 0;
          this.state = START_BOUNDARY;
        /* falls through */
        case START_BOUNDARY:
          if (index === this.boundaryLength - 2 && c === HYPHEN) {
            index = 1;
            this.state = CLOSE_BOUNDARY;
            break;
          } else if (index === this.boundaryLength - 2) {
            if (c !== CR) {
              throw new HttpError(400, "Expected CR Received  " + c);
            }
            index++;
            break;
          } else if (index === this.boundaryLength - 1) {
            if (c !== LF) {
              throw new HttpError(400, "Expected LF Received " + c);
            }
            index = 0;
            this.clearPartVars();
            this.state = HEADER_FIELD_START;
            break;
          }

          if (c !== this.boundary[index + 2]) {
            index = -2;
          }
          if (c === this.boundary[index + 2]) {
            index++;
          }
          break;
        case HEADER_FIELD_START:
          this.state = HEADER_FIELD;
          this.headerFieldMark = i;
          index = 0;
        /* falls through */
        case HEADER_FIELD:
          if (c === CR) {
            this.headerFieldMark = null;
            this.state = HEADERS_ALMOST_DONE;
            break;
          }

          index++;

          if (c === HYPHEN) {
            break;
          }

          if (c === COLON) {
            if (index === 1) {
              throw new HttpError(400, "Empty header field");
            }
            this.onParseHeaderField(buffer.slice(this.headerFieldMark, i));
            this.headerFieldMark = null;
            this.state = HEADER_VALUE_START;
            break;
          }

          cl = c | 0x20;

          if (cl < A || cl > Z) {
            throw new HttpError(400, "Expected alphabetic character, received " + c);
          }

          break;
        case HEADER_VALUE_START:
          if (c === SPACE) {
            break;
          }

          this.headerValueMark = i;
          this.state = HEADER_VALUE;
        /* falls through */
        case HEADER_VALUE:
          if (c === CR) {
            this.onParseHeaderValue(buffer.slice(this.headerValueMark, i));
            this.headerValueMark = null;
            this.onParseHeaderEnd();
            this.state = HEADER_VALUE_ALMOST_DONE;
          }
          break;
        case HEADER_VALUE_ALMOST_DONE:
          if (c !== LF) {
            throw new HttpError(400, "Expected LF Received " + c);
          }
          this.state = HEADER_FIELD_START;
          break;
        case HEADERS_ALMOST_DONE:
          if (c !== LF) {
            throw new HttpError(400, "Expected LF Received " + c);
          }
          this.onParseHeadersEnd();
          this.state = PART_DATA_START;
          break;
        case PART_DATA_START:
          this.state = PART_DATA;
          this.partDataMark = i;
        /* falls through */
        case PART_DATA:
          prevIndex = index;

          if (index === 0) {
            // boyer-moore derrived algorithm to safely skip non-boundary data
            i += boundaryEnd;
            while (i < len && !(buffer[i] in this.boundaryChars)) {
              i += this.boundaryLength;
            }
            i -= boundaryEnd;
            c = buffer[i];
          }

          if (index < this.boundaryLength) {
            if (this.boundary[index] === c) {
              if (index === 0) {
                this.onParsePart(buffer.slice(this.partDataMark, i));
                this.partDataMark = null;
              }
              index++;
            } else {
              index = 0;
            }
          } else if (index === this.boundaryLength) {
            index++;
            if (c === CR) {
              // CR = part boundary
              this.partBoundaryFlag = true;
            } else if (c === HYPHEN) {
              index = 1;
              this.state = CLOSE_BOUNDARY;
              break;
            } else {
              index = 0;
            }
          } else if (index - 1 === this.boundaryLength) {
            if (this.partBoundaryFlag) {
              index = 0;
              if (c === LF) {
                this.partBoundaryFlag = false;
                this.onParsePartEnd();
                this.clearPartVars();
                this.state = HEADER_FIELD_START;
                break;
              }
            } else {
              index = 0;
            }
          }

          if (index > 0) {
            // when matching a possible boundary, keep a lookbehind reference
            // in case it turns out to be a false lead
            this.lookBehind[index - 1] = c;
          } else if (prevIndex > 0) {
            // if our boundary turned out to be rubbish, the captured lookbehind
            // belongs to partData
            this.onParsePart(this.lookBehind.slice(0, prevIndex));
            prevIndex = 0;
            this.partDataMark = i;

            // reconsider the current character even so it interrupted the sequence
            // it could be the beginning of a new sequence
            i--;
          }

          break;
        case CLOSE_BOUNDARY:
          if (c !== HYPHEN) {
            throw new HttpError(400, "Expected HYPHEN Received " + c);
          }
          if (index === 1) {
            this.onParsePartEnd();
            this.state = END;
          } else if (index > 1) {
            throw new HttpError(400, "Parser has invalid state.");
          }
          index++;
          break;
        case END:
          break;
        default:
          throw new HttpError(400, "Parser has invalid state.");
      }
    }

    return this.partData;
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#onParseHeaderEnd
   * @private
   *
   * @description
   * On parse header end
   */
  private onParseHeaderEnd() {
    this.headerField = this.headerField.toLowerCase();
    this.partHeaders[this.headerField] = this.headerValue;

    let match;
    if (this.headerField === "content-disposition") {
      if (match = this.headerValue.match(/\bname="([^"]+)"/i)) {
        this.partName = match[1];
      }
      this.partFileName = this.parseFilename(this.headerValue);
    } else if (this.headerField === "content-transfer-encoding") {
      this.partTransferEncoding = this.headerValue.toLowerCase();
    }

    this.headerFieldDecoder = new StringDecoder(this.encoding);
    this.headerField = "";
    this.headerValueDecoder = new StringDecoder(this.encoding);
    this.headerValue = "";
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#onParsePartEnd
   * @private
   *
   * @description
   * On parse end set values
   */
  private onParsePartEnd() {
    let buffer = Buffer.concat(this.partFileBufferList);
    if (isTruthy(this.partFileName)) {
      this.partData.push(
        new MultiPartFile(
          this.partName,
          this.partFileName,
          this.partTransferEncoding,
          buffer
        )
      );
    } else {
      this.partData.push(
        new MultiPartField(
          this.partName,
          buffer.toString(),
          this.partTransferEncoding,
          buffer
        )
      );
    }
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#onParseHeadersEnd
   * @private
   *
   * @description
   * Parse headers end
   */
  private onParseHeadersEnd() {
    switch (this.partTransferEncoding) {
      case "binary":
      case "7bit":
      case "8bit":
        this.partTransferEncoding = "binary";
        break;
      case "base64":
        break;
      default:
        throw new HttpError(400, "Unknown transfer-encoding: " + this.partTransferEncoding);
    }
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#parseFilename
   * @param {String} headerValue
   * @private
   *
   * @description
   * Parse file name
   */
  private parseFilename(headerValue: string) {
    let match = headerValue.match(/\bfilename="(.*?)"($|; )/i);
    if (!match) {
      match = headerValue.match(/\bfilename\*=utf-8\'\'(.*?)($|; )/i);
      if (match) {
        match[1] = decodeURI(match[1]);
      } else {
        return null;
      }
    }
    let filename = match[1];
    filename = filename.replace(/%22|\\"/g, '"');
    filename = filename.replace(/&#([\d]{4});/g, function (m, code) {
      return String.fromCharCode(code);
    });
    return filename.substr(filename.lastIndexOf("\\") + 1);
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#onParseHeaderField
   * @private
   *
   * @description
   * Parse header filed
   */
  private onParseHeaderField(buffer: Buffer) {
    this.headerField += this.headerFieldDecoder.write(buffer);
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#onParseHeaderValue
   * @private
   *
   * @description
   * Parse header value
   */
  private onParseHeaderValue(buffer: Buffer) {
    this.headerValue += this.headerValueDecoder.write(buffer);
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#onParsePart
   * @private
   *
   * @description
   * Push file to buffer
   */
  private onParsePart(buffer: Buffer) {
    this.partFileBufferList.push(buffer);
  }

  /**
   * @since 1.0.0
   * @function
   * @name MultiPart#clearPartVars
   * @private
   *
   * @description
   * Clear part variables
   */
  private clearPartVars() {
    this.partHeaders = {};
    this.partName = null;
    this.partFileName = null;
    this.partTransferEncoding = "binary";
    this.partFileBufferList = [];

    this.headerFieldDecoder = new StringDecoder(this.encoding);
    this.headerField = "";
    this.headerValueDecoder = new StringDecoder(this.encoding);
    this.headerValue = "";
  }

}
