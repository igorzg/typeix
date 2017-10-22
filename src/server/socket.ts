import {IncomingMessage} from "http";
import {IModule} from "../interfaces/imodule";

export function fireWebSocket() {
  // todo
}

/**
 * @since 1.1.0
 * @function
 * @name verifyWssClient
 * @return {boolean}
 * @private
 */
export function verifyWssClient(modules: Array<IModule>, req: IncomingMessage): boolean {
  return false;
}
