import {Metadata, FUNCTION_KEYS} from "../injector/metadata";
import {isEqual} from "../core";
import {IAction} from "../interfaces/iaction";
/**
 * On error decorator
 * @decorator
 * @function
 * @name OnError
 *
 * @param {Number} status
 * @param {String} message
 *
 * @description
 * Define custom error message
 */
export let OnError = (status: number, message: string): Function => {
  return (Class: Function, key: string, descriptor: PropertyDescriptor): Function => {
    let type = "OnError";
    let metadata: Array<any> = [];
    if (Metadata.hasMetadata(Class, FUNCTION_KEYS)) {
      metadata = Metadata.getMetadata(Class, FUNCTION_KEYS);
    }
    if (metadata.find(item => item.type === type && item.key === key)) {
      throw new TypeError(`Only one @${type} definition is allowed on ${key} ${Metadata.getName(Class, "on class ")}`);
    } else if (!Metadata.isDescriptor(descriptor) && !isEqual(Class, descriptor)) {
      throw new TypeError(`@${type} is allowed ony on function type ${Metadata.getName(Class, "on class ")}`);
    }

    let iAction: IAction = {
      type,
      key,
      value: {
        status,
        message
      },
      proto: Class
    };

    metadata.push(iAction);
    Metadata.defineMetadata(Class, FUNCTION_KEYS, metadata);
    if (Metadata.isDescriptor(descriptor)) {
      descriptor.configurable = false;
      descriptor.writable = false;
    }
    return Class;
  };
};
