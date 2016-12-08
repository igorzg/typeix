import {isUndefined, isPresent} from "../core";
import {Metadata, INJECT_KEYS} from "../injector/metadata";
import {IInjectParam, IInjectKey} from "../interfaces/idecorators";

/**
 * @since 1.0.0
 * @decorator
 * @function
 * @name Inject
 *
 * @description
 * Inject is used to define metadata which will be injected at class construct time by Injector
 *
 * @example
 * import {Provider, Inject} from "typeix";
 * import {MyService} form "./services/my-service";
 *
 * \@Provider([MyService])
 * class AssetLoader{
 *    \@Inject(MyService)
 *    private myService;
 * }
 */
export let Inject = (value: Function|string, isMutable?: boolean) => {
  return (Class: any, key?: any, paramIndex?: any): any => {
    let metadata: Array<IInjectParam|IInjectKey> = [];
    if (Metadata.hasMetadata(Class, INJECT_KEYS)) {
      metadata = Metadata.getMetadata(Class, INJECT_KEYS);
    }
    if (Metadata.isDescriptor(paramIndex)) {
      throw new TypeError(`@Inject is not allowed ${Metadata.getName(Class, "on class ")} on ${paramIndex.value}
      @Inject is allowed only as param type!`);
    }
    metadata.push(isUndefined(paramIndex) ? {
      value,
      isMutable: !!isMutable,
      key
    } : {
      value,
      paramIndex
    });
    Metadata.defineMetadata(Class, INJECT_KEYS, metadata);
    return Class;
  };
};
