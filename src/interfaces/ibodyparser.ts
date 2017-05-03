/**
 * @since 1.0.0
 * @interface
 * @name IBodyParser
 *
 * @description
 * Body parser interface
 */
export interface IBodyParser {
  parse(content: Buffer): any;
}
