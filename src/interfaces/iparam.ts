/**
 * @since 1.0.0
 * @interface
 * @name IParam
 * @param {Class} Function constructor of parameter
 * @param {String} type of annotation
 * @param {String} key mapped function name
 * @param {String} value name
 * @param {Number} paramIndex
 *
 * @description
 * IParam definition type
 */
export interface IParam {
  Class: Function;
  type: string;
  key: string;
  value: string;
  paramIndex: number;
}
