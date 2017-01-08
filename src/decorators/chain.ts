import {isNumber} from "../core";
import {Metadata, FUNCTION_PARAMS} from "../injector/metadata";

/**
 * @since 1.0.0
 * @decorator
 * @function
 * @name Chain
 *
 * @description
 * Chain propagate data from FilterBefore -> BeforeEach -> Before -> Action -> After -> AfterEach -> FilterAfter
 *
 * @example
 * import {Chain, Param, Controller, Action, Inject} from "typeix";
 *
 * \@Controller({
 *    name: "myController"
 * })
 * class MyController{
 *
 *     \@Before("index")
 *     actionIndex() {
 *        return "My Index";
 *     }
 *
 *     \@Action("index")
 *     actionIndex(@Chain() data, @Param("file") file: string) {
 *        return "My Index " + data;
 *     }
 * }
 */
export let Chain = (Class: any, key?: any, paramIndex?: any): any => {
  let type = "Chain";
  let metadata: Array<any> = [];
  if (Metadata.hasMetadata(Class, FUNCTION_PARAMS)) {
    metadata = Metadata.getMetadata(Class, FUNCTION_PARAMS);
  }
  if (!isNumber(paramIndex)) {
    throw new TypeError(`@Chain is not allowed ${Metadata.getName(Class, "on class ")} on ${paramIndex}
      @Chain is allowed only as parameter type!`);
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
