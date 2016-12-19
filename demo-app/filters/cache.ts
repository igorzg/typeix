import {IFilter, Filter, RequestReflection, Inject} from "typeix";

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
   * @param {RequestReflection} request
   * @description
   * Request reflection
   */
  @Inject(RequestReflection)
  request: RequestReflection;

  /**
   * @function
   * @name Cache#before
   *
   * @description
   * Before each controller
   */
  before(): string|Buffer|Promise<string|Buffer> {
    return "Before controller";
  }
  /**
   * @function
   * @name Cache#before
   *
   * @description
   * Before each controller apply this filter
   */
  after(data: string): string|Buffer|Promise<string|Buffer> {
    return "After controller <- " + data;
  }

}
