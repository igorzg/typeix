import {IFilter, Filter, Request, Inject} from "typeix";

/**
 * @constructor
 * @function
 * @name ChainFilter
 *
 * @description
 * Chain filter example
 */
@Filter(80)
export class ChainFilter implements IFilter {
  /**
   * @param {Request} request
   * @description
   * ControllerResolver reflection
   */
  @Inject(Request)
  request: Request;

  /**
   * @function
   * @name Cache#before
   *
   * @description
   * Before each controller
   */
  before(data: string): string|Buffer|Promise<string|Buffer> {
    return "Before chain controller filter <-" + data;
  }
  /**
   * @function
   * @name Cache#before
   *
   * @description
   * Before each controller apply this filter
   */
  after(data: string): string|Buffer|Promise<string|Buffer> {
    return "After chain controller filter <- " + data;
  }

}
