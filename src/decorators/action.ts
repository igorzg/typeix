import {Metadata, FUNCTION_KEYS} from "../injector/metadata";
import {isEqual} from "../core";
/**
 * Action decorator
 * @decorator
 * @function
 * @name Action
 *
 * @param {String} value
 *
 * @description
 * Define name of action to class
 */
export var Action = (value: string): Function => {
  return (Class: Function, key: string, descriptor: PropertyDescriptor): Function => {
    let type = "Action";
    let metadata: Array<any> = [];
    if (Metadata.hasMetadata(Class, FUNCTION_KEYS)) {
      metadata = Metadata.getMetadata(Class, FUNCTION_KEYS);
    }
    if (metadata.find(item => item.type === type && item.key === key)) {
      throw new TypeError(`Only one action definition is allowed on ${key} ${Metadata.getName(Class, "on class ")}`);
    } else if (!Metadata.isDescriptor(descriptor) && !isEqual(Class, descriptor)) {
      throw new TypeError(`@${type} is allowed ony on function type ${Metadata.getName(Class, "on class ")}`);
    }
    metadata.push({
      type,
      key,
      value
    });
    Metadata.defineMetadata(Class, FUNCTION_KEYS, metadata);
    if (Metadata.isDescriptor(descriptor)) {
      descriptor.configurable = false;
      descriptor.writable = false;
    }
    return Class;
  };
};
