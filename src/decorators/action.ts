import {FUNCTION_KEYS, Metadata} from "../injector/metadata";
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
  return (Class: Function, key: string, descriptor: PropertyDescriptor): any => {
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
let mapEachAction = (type) =>
  (Class: any, key: string, descriptor: PropertyDescriptor): any => {
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

/**
 * @since 2.0.0
 * @decorator
 * @function
 * @name Hook
 *
 * @param {String} value One of "verify"|"open"|"message"
 *
 * @description
 * Define a WebSocket method hook to be called for one of the actions "verify",
 * "open", or "message". All hooks support injection with {@link Inject} and {@link Param}.
 *
 * The "verify" hook is called before the socket is fully established. If you want to deny
 * opening the socket just throw an {@link HttpError}.
 *
 * When the socket is opened the "open" hook is called. You can inject the {@link Socket}
 * as parameter in this method in order to get access to the underlying Socket API.
 *
 * To receive and handle messages from the other side provide a "message" hook. You can inject
 * a parameter "message" there which is the data received over the socket.
 *
 * @example
 * import {WebSocket, Hook, BaseRequest} from "typeix";
 *
 * \@WebSocket({...})
 * export class MySocket {
 *   \@Inject(BaseRequest)
 *   private readonly request: BaseRequest;
 *
 *   \@Hook("verify")
 *   verify(): void {
 *     if (!this.request.getRequestHeader("my-header") === "approved") {
 *       throw new HttpError(403, "You are not approved");
 *     }
 *   }
 *
 *   \@Hook("open")
 *   open(@Inject(Socket) socket: Socket) {
 *   }
 * }
 */
export let Hook: (value: "verify" | "open" | "message") => any = mapAction("Hook");
