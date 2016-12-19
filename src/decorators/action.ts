import {Metadata, FUNCTION_KEYS} from "../injector/metadata";
import {isEqual} from "../core";
import {IAction} from "../interfaces/iaction";

/**
 * Action decorator
 * @decorator
 * @function
 * @private
 * @name mapAction
 *
 * @param {String} type
 *
 * @description
 * Multiple action type providers
 */
let mapAction = (type) => (value: string): Function => {
  return (Class: Function, key: string, descriptor: PropertyDescriptor): Function => {
    let metadata: Array<any> = [];
    let className: string = Metadata.getName(Class);
    if (Metadata.hasMetadata(Class, FUNCTION_KEYS)) {
      metadata = Metadata.getMetadata(Class, FUNCTION_KEYS);
    }
    if (metadata.find(item => item.type === type && item.key === key && item.className === className)) {
      throw new TypeError(`Only one @${type} definition is allowed on ${key} ${Metadata.getName(Class, "on class ")}`);
    } else if (!Metadata.isDescriptor(descriptor) && !isEqual(Class, descriptor)) {
      throw new TypeError(`@${type} is allowed ony on function type ${Metadata.getName(Class, "on class ")}`);
    }
    let iAction: IAction = {
      type,
      key,
      value,
      className: Metadata.getName(Class)
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
/**
 * Action decorator
 * @decorator
 * @function
 * @name mapEachAction
 *
 * @param {String} type
 *
 * @description
 * Map each action type
 */
let mapEachAction = (type) => (): Function => {
  return (Class: Function, key: string, descriptor: PropertyDescriptor): Function => {
    let metadata: Array<any> = [];
    let className: string = Metadata.getName(Class);
    if (Metadata.hasMetadata(Class, FUNCTION_KEYS)) {
      metadata = Metadata.getMetadata(Class, FUNCTION_KEYS);
    }
    if (metadata.find(item => item.type === type && item.className === className)) {
      throw new TypeError(`Only one @${type} definition is allowed ${Metadata.getName(Class, "on class ")}`);
    } else if (!Metadata.isDescriptor(descriptor) && !isEqual(Class, descriptor)) {
      throw new TypeError(`@${type} is allowed ony on function type ${Metadata.getName(Class, "on class ")}`);
    }
    let iAction: IAction = {
      type,
      key,
      value: null,
      className: Metadata.getName(Class)
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

/**
 * Action decorator
 * @decorator
 * @function
 * @name BeforeEach
 *
 * @description
 * Before each action
 */
export let BeforeEach = mapEachAction("BeforeEach");

/**
 * Action decorator
 * @decorator
 * @function
 * @name AfterEach
 *
 * @description
 * After each action
 */
export let AfterEach = mapEachAction("AfterEach");
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
export let Action = mapAction("Action");
/**
 * Before Action decorator
 * @decorator
 * @function
 * @name Before
 *
 * @param {String} value
 *
 * @description
 * Define name of before action to class
 */
export let Before = mapAction("Before");
/**
 * After Action decorator
 * @decorator
 * @function
 * @name After
 *
 * @param {String} value
 *
 * @description
 * Define name of after action to class
 */
export let After = mapAction("After");
