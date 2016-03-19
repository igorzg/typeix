import * as Reflect from 'reflect-metadata';
import { inspect } from 'util';


const METADATA_KEYS = 'design:paramtypes';
const COMPONENT_CONFIG_KEYS = 'component:config';


/**
 * @license Mit Licence 2016
 * @since 1.0.0
 * @function
 * @name Injector
 *
 * @param {Injector} parent injector
 *
 * @description
 * Dependency injection for class injection
 *
 */
export class Injector {
	private list:Map<any, any> = new Map();
	private children: Array<Injector> = [];
	constructor(private parent?:Injector) {}

	set(key:any, value:Object):void {
		this.list.set(key, value);
	}

	has(key:any):boolean {
		return this.list.has(key);
	}

	get(key:any):any {
		if (!this.has(key) && this.parent instanceof Injector) {
			return this.parent.get(key);
		}
		return this.list.get(key);
	}

	setChild(injector: Injector) {
		this.children.push(injector);
	}

	removeChild(injector: Injector) {
		this.children.splice(this.children.indexOf(injector), 1);
	}

	destroy() {
		if (this.parent instanceof Injector) {
			this.parent.removeChild(this);
		}
		this.children.forEach(injector => injector.destroy());
		this.children = null;
		this.parent = null;
		this.list = null;
	}

	createAndResolve(Class:Function, o?:Array<any>) : any {
		if (Array.isArray(o)) {
			o = o.map(ChildClass => {
				if (!this.has(ChildClass) && typeof ChildClass === 'function') {
					let child = this.createAndResolve(
						ChildClass,
						Injector.getMetadata(ChildClass)
					);
					this.set(ChildClass, child);
				} else if (typeof ChildClass === 'object' && ChildClass !== null) {
					return ChildClass;
				} else if (!this.has(ChildClass)) {
					throw new Error(` Invalid injection type for
						${ChildClass.toString()}
					`);
				}
				return this.get(ChildClass);
			});
		}
		return Injector.initialize(Class, o);
	}

	static getMetadata(Class:Function) : Array<any>{
		let metadata = Reflect.getMetadata(METADATA_KEYS, Class);
		if (!Array.isArray(metadata)) {
			return [];
		}
		return metadata;
	}

	static createAndResolveChild(injector:Injector, Class:Function, o?:Array<any>) {
		let childInjector = new Injector(injector);
		childInjector.createAndResolve(Class, o);
		injector.setChild(childInjector);
		return childInjector;
	}

	static createAndResolve(Class:Function, o?:Array<any>) {
		let childInjector = new Injector();
		childInjector.createAndResolve(Class, o);
		return childInjector;
	}

	static initialize(t:any, o:Array<any>):any {
		if (!Array.isArray(o)) {
			return new t();
		}
		return Reflect.construct(t, o);
	};
}

