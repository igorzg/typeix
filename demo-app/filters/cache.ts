import {IFilter, Filter, Request, Inject} from "typeix";

/**
 * @constructor
 * @function
 * @name Cache
 *
 * @description
 * Cache filter example
 */
@Filter(100)
export class Cache implements IFilter {
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
    return "Before cache controller filter <-" + data;
  }
  /**
   * @function
   * @name Cache#before
   *
   * @description
   * Before each controller apply this filter
   */
  after(data: string): string|Buffer|Promise<string|Buffer> {
    return "After cache controller filter <- " + data;
  }

}
