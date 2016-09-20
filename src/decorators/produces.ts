/**
 * Produces response type
 * @decorator
 * @function
 * @name Produces
 *
 * @param {String} name
 *
 * @description
 * Produces content type
 */
export var Produces = (name: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  console.log(name);
  return target;
};

