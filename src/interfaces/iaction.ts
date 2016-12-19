/**
 * @since 1.0.0
 * @interface
 * @name ErrorMessage
 * @param {number} status
 * @param {string} message
 *
 * @description
 * Error message
 */
export interface ErrorMessage {
  status: number;
  message: string;
}
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
  value: string | ErrorMessage;
  className: string;
}
