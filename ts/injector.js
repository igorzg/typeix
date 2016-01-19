function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('reflect-metadata'));
const METADATA_KEYS = 'design:paramtypes';
const COMPONENT_CONFIG_KEYS = 'component:config';
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token === undefined || token === null) {
        return '' + token;
    }
    if (token.name) {
        return token.name;
    }
    if (token.overriddenName) {
        return token.overriddenName;
    }
    var res = token.toString();
    var newLineIndex = res.indexOf("\n");
    return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}
exports.stringify = stringify;
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
class Injector {
    constructor(parent) {
        this.parent = parent;
        this.list = new Map();
        this.children = [];
    }
    set(key, value) {
        this.list.set(key, value);
    }
    has(key) {
        return this.list.has(key);
    }
    get(key) {
        if (!this.has(key) && this.parent instanceof Injector) {
            return this.parent.get(key);
        }
        return this.list.get(key);
    }
    setChild(injector) {
        this.children.push(injector);
    }
    removeChild(injector) {
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
    createAndResolve(Class, o) {
        if (Array.isArray(o)) {
            o = o.map(ChildClass => {
                if (!this.has(ChildClass) && typeof ChildClass === 'function') {
                    let child = this.createAndResolve(ChildClass, Injector.getMetadata(ChildClass));
                    this.set(ChildClass, child);
                }
                else if (typeof ChildClass === 'object' && ChildClass !== null) {
                    return ChildClass;
                }
                else if (!this.has(ChildClass)) {
                    throw new Error(` Invalid injection type for
						${stringify(ChildClass)}
					`);
                }
                return this.get(ChildClass);
            });
        }
        return Injector.initialize(Class, o);
    }
    static getMetadata(Class) {
        let metadata = Reflect.getMetadata(METADATA_KEYS, Class);
        if (!Array.isArray(metadata)) {
            return [];
        }
        return metadata;
    }
    static createAndResolveChild(injector, Class, o) {
        let childInjector = new Injector(injector);
        childInjector.createAndResolve(Class, o);
        injector.setChild(childInjector);
        return childInjector;
    }
    static createAndResolve(Class, o) {
        let childInjector = new Injector();
        childInjector.createAndResolve(Class, o);
        return childInjector;
    }
    static initialize(t, o) {
        if (!Array.isArray(o)) {
            return new t();
        }
        switch (t.length) {
            case 1:
                return new t(o[0]);
            case 2:
                return new t(o[0], o[1]);
            case 3:
                return new t(o[0], o[1], o[2]);
            case 4:
                return new t(o[0], o[1], o[2], o[3]);
            case 5:
                return new t(o[0], o[1], o[2], o[3], o[4]);
            case 6:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5]);
            case 7:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6]);
            case 8:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7]);
            case 9:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8]);
            case 10:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9]);
            case 11:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10]);
            case 12:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11]);
            case 13:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12]);
            case 14:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13]);
            case 15:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13], o[14]);
            case 16:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13], o[14], o[15]);
            case 17:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13], o[14], o[15], o[16]);
            case 18:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13], o[14], o[15], o[16], o[17]);
            case 19:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13], o[14], o[15], o[16], o[17], o[18]);
            case 20:
                return new t(o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7], o[8], o[9], o[10], o[11], o[12], o[13], o[14], o[15], o[16], o[17], o[18], o[19]);
            default:
                return new t();
        }
        throw new Error(`Cannot create a instance for '${stringify(t)}' because its constructor has more than 20 arguments`);
    }
    ;
}
exports.Injector = Injector;
//# sourceMappingURL=injector.js.map