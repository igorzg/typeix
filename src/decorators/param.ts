import {isNumber} from "../core";
import {Metadata, FUNCTION_PARAMS} from "../injector/metadata";
import {IParam} from "../interfaces/iparam";

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
    if (Metadata.hasMetadata(Class, FUNCTION_PARAMS)) {
      metadata = Metadata.getMetadata(Class, FUNCTION_PARAMS);
    }
    if (!isNumber(paramIndex)) {
      throw new TypeError(`@Param is not allowed ${Metadata.getName(Class, "on class ")} on ${paramIndex}
      @Param is allowed only as parameter type!`);
    }
    let param: IParam = {
      Class: Metadata.getName(Class),
      type,
      key,
      value,
      paramIndex
    };
    metadata.push(param);
    Metadata.defineMetadata(Class, FUNCTION_PARAMS, metadata);
    return Class;
  };
};
