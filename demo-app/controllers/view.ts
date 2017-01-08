import {Inject, Controller, Request, AfterEach, Chain,  Action} from "typeix";
import {CoreController} from "./core";
/**
 * Controller example
 * @constructor
 * @function
 * @name HomeController
 *
 * @description
 * Define controller, assign action and inject your services.
 * Each request create new instance of controller, your Injected type is injected by top level injector if is not defined
 * as local instance as providers to this controllers
 */
@Controller({
  name: "view",
  providers: [] // type of local instances within new request since controller is instanciated on each request
})
export class ViewController extends CoreController {

  /**
   * @param {Request} request
   * @description
   * ControllerResolver reflection
   */
  @Inject(Request)
  request: Request;

  /**
   * @function
   * @name actionIndex
   *
   * @description
   * There is no naming convention of function names only what is required to define action is \@Action metadata
   *
   * @example
   * \@Action("index")
   *  iIgnoreNamingConvention(): string {
   *    return "Only important fact is a \@Action param";
   * }
   *
   */
  @Action("index")
  actionIndex(@Chain data: string): string {
    return "My action view <- " + data;
  }


  /**
   * @function
   * @name AfterEach
   *
   * @description
   * After each action
   *
   */
  @AfterEach
  afterEachAction(@Chain data: string): string {
    return "After each view <- " + data;
  }

}
