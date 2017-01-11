import {isNumber} from "../core";
import {Metadata, FUNCTION_PARAMS} from "../injector/metadata";

/**
 * @since 1.0.0
 * @decorator
 * @function
 * @name Error
 *
 * @description
 * Chain propagate data from FilterBefore -> BeforeEach -> Before -> Action -> After -> AfterEach -> FilterAfter
 *
 * @example
 * import {Chain, Param, Controller, Action, Inject} from "typeix";
 *
 * \@Controller({
 *    name: "core"
 * })
 * class MyController{
 *
 *     \@Action("error")
 *     actionIndex(@Error data) {
 *        return "My Index " + data;
 *     }
 * }
 */
export let Error = (Class: any, key?: any, paramIndex?: any): any => {
  let type = "Error";
  let metadata: Array<any> = [];
  if (Metadata.hasMetadata(Class, FUNCTION_PARAMS)) {
    metadata = Metadata.getMetadata(Class, FUNCTION_PARAMS);
  }
  if (!isNumber(paramIndex)) {
    throw new TypeError(`@${type} is not allowed ${Metadata.getName(Class, "on class ")} on ${paramIndex}
      @${type} is allowed only as parameter type!`);
  }
  metadata.push({
    type,
    key,
    value: null,
    paramIndex
  });
  Metadata.defineMetadata(Class, FUNCTION_PARAMS, metadata);
  return Class;
};
