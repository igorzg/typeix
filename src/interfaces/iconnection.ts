/**
 * @since 1.0.0
 * @interface
 * @name IConnection
 * @param {String} method
 * @param {String} url
 * @param {String} httpVersion
 * @param {Number} httpVersionMajor
 * @param {Number} httpVersionMinor
 * @param {String} remoteAddress
 * @param {String} remoteFamily
 * @param {Number} remotePort
 * @param {String} localAddress
 * @param {Number} localPort
 *
 * @description
 * Current connection data
 */
export interface IConnection {
  uuid: string;
  method: string;
  url: string;
  httpVersion: string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  remoteAddress: string;
  remoteFamily: string;
  remotePort: number;
  localAddress: string;
  localPort: number;
}
