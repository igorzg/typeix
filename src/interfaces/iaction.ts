/**
 * @since 1.0.0
 * @interface
 * @name IAction
 * @param {String} type of annotation
 * @param {String} key mapped function name
 * @param {String} value route name
 *
 * @description
 * IAction
 */
export interface IAction {
  type: string;
  key: string;
  value: string;
}
