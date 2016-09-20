/**
 * Action decorator
 * @decorator
 * @function
 * @name Action
 *
 * @param {String} name
 *
 * @description
 * Define name of action to class
 */
export var Action = (name: string) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  console.log(name);
  return target;
};
