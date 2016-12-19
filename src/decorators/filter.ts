import {TFilter} from "../interfaces/ifilter";
import {isClass} from "../core";
import {Metadata} from "../injector/metadata";
/**
 * @since 1.0.0
 * @decorator
 * @function
 * @name Filter
 *
 * @description
 * Filter is used as pre controller and after controller actions
 *
 * @example
 * import {IFilter, Filter, RequestReflection, Inject} from "typeix";
 *
 * \@Filter(100)
 * export class Cache implements IFilter {
 *
 *  \@Inject(RequestReflection)
 *  request: RequestReflection;
 *
 *
 *  before(): string|Buffer|Promise<string|Buffer> {
 *    return "Before controller";
 *  }
 *
 *  after(data: string): string|Buffer|Promise<string|Buffer> {
 *    return "After controller <- " + data;
 *  }
 *
 *}
 */
export let Filter = (priority: number, route: string = "*"): Function => {
  return (Class: TFilter): any => {
    if (!isClass(Class)) {
      throw new TypeError(`Filter is only allowed on class type of IFilter!  Error found on ${Class.toString()}`);
    }
    Metadata.setComponentConfig(Class, {
      priority,
      route
    });
    return Class;
  };
}
