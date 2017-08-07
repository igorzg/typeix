import {isUndefined} from "../core";
import {FUNCTION_PARAMS, INJECT_KEYS, Metadata} from "../injector/metadata";
import {IInjectKey} from "../interfaces/idecorators";
import {IParam} from "../interfaces/iparam";

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
export let Inject = (value: Function | string, isMutable?: boolean) => {
  return (Class: any, key?: string, paramIndex?: any): any => {
    let type = "Inject";
    let metadata: Array<IInjectKey | IParam> = [];
    let metadataKey = isUndefined(paramIndex) ? INJECT_KEYS : FUNCTION_PARAMS;
    if (Metadata.hasMetadata(Class, metadataKey)) {
      metadata = Metadata.getMetadata(Class, metadataKey);
    }

    if (Metadata.isDescriptor(paramIndex)) {
      throw new TypeError(`@${type} is not allowed ${Metadata.getName(Class, "on class ")} on ${paramIndex.value}
      @Inject is allowed only as param type!`);
    }

    if (!metadata.find((item: IParam) => item.key === key && isUndefined(item.paramIndex))) {
      metadata.push(isUndefined(paramIndex) ? {
        Class: Metadata.getName(value),
        value,
        isMutable: !!isMutable,
        key
      } : {
        Class: Metadata.getName(value),
        type,
        key,
        value: <string> value,
        paramIndex
      });
    }

    Metadata.defineMetadata(Class, metadataKey, metadata);
    return Class;
  };
};
