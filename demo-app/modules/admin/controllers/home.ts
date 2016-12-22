import {Inject, Action, Controller, RequestReflection, Before, Chain, BeforeEach, Param} from "typeix";

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
  name: "home",
  providers: [] // type of local instances within new request since controller is instanciated on each request
})
export class HomeController {


  /**
   * @param {RequestReflection} request
   * @description
   * Request reflection
   */
  @Inject(RequestReflection)
  request: RequestReflection;


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
  actionIndex(): string {
    return `Action index: admin module`;
  }

  /**
   * @function
   * @name BeforeEach
   *
   * @description
   * before each
   *
   */
  @BeforeEach()
  beforeEachAction(@Chain() data: string): string {
    return "Before each core <- " + data;
  }

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
  @Before("index")
  beforeIndex(@Chain() data: string): string {
    return "Before index home: <- " + data;
  }

}