import {isNumber} from "../core";
import {Metadata, FUNCTION_KEYS} from "../injector/metadata";

/**
 * @since 1.0.0
 * @decorator
 * @function
 * @name Param
 *
 * @description
 * Define Param metadata to deliver it from router
 *
 * @example
 * import {Param, Controller, Action, Inject} from "typeix";
 *
 * \@Controller({
 *    name: "myController"
 * })
 * class MyController{
 *
 *     \@Inject(AssetLoader)
 *     myAssetLoaderService: AssetLoader;
 *
 *     \@Action("index")
 *     assetLoader(@Param("file") file: string) {
 *        return this.myAssetLoaderService.load(file);
 *     }
 * }
 */
export let Param = (value: string) => {
  return (Class: any, key?: any, paramIndex?: any): any => {
    let type = "Param";
    let metadata: Array<any> = [];
    if (Metadata.hasMetadata(Class, FUNCTION_KEYS)) {
      metadata = Metadata.getMetadata(Class, FUNCTION_KEYS);
    }
    if (!isNumber(paramIndex)) {
      throw new TypeError(`@Param is not allowed ${Metadata.getName(Class, "on class ")} on ${paramIndex}
      @Param is allowed only as parameter type!`);
    }
    metadata.push({
      type,
      key,
      value,
      paramIndex
    });
    Metadata.defineMetadata(Class, FUNCTION_KEYS, metadata);
    return Class;
  };
};
