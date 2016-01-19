function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('reflect-metadata'));
var METADATA_KEYS = 'design:paramtypes';
var COMPONENT_CONFIG_KEYS = 'component:config';
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
var Injector = (function () {
    function Injector(parent) {
        this.parent = parent;
        this.list = new Map();
        this.children = [];
    }
    Injector.prototype.set = function (key, value) {
        this.list.set(key, value);
    };
    Injector.prototype.has = function (key) {
        return this.list.has(key);
    };
    Injector.prototype.get = function (key) {
        if (!this.has(key) && this.parent instanceof Injector) {
            return this.parent.get(key);
        }
        return this.list.get(key);
    };
    Injector.prototype.setChild = function (injector) {
        this.children.push(injector);
    };
    Injector.prototype.removeChild = function (injector) {
        this.children.splice(this.children.indexOf(injector), 1);
    };
    Injector.prototype.destroy = function () {
        if (this.parent instanceof Injector) {
            this.parent.removeChild(this);
        }
        this.children.forEach(function (injector) { return injector.destroy(); });
        this.children = null;
        this.parent = null;
        this.list = null;
    };
    Injector.prototype.createAndResolve = function (Class, o) {
        var _this = this;
        if (Array.isArray(o)) {
            o = o.map(function (ChildClass) {
                if (!_this.has(ChildClass) && typeof ChildClass === 'function') {
                    var child = _this.createAndResolve(ChildClass, Injector.getMetadata(ChildClass));
                    _this.set(ChildClass, child);
                }
                else if (typeof ChildClass === 'object' && ChildClass !== null) {
                    return ChildClass;
                }
                else if (!_this.has(ChildClass)) {
                    throw new Error(" Invalid injection type for\n\t\t\t\t\t\t" + stringify(ChildClass) + "\n\t\t\t\t\t");
                }
                return _this.get(ChildClass);
            });
        }
        return Injector.initialize(Class, o);
    };
    Injector.getMetadata = function (Class) {
        var metadata = Reflect.getMetadata(METADATA_KEYS, Class);
        if (!Array.isArray(metadata)) {
            return [];
        }
        return metadata;
    };
    Injector.createAndResolveChild = function (injector, Class, o) {
        var childInjector = new Injector(injector);
        childInjector.createAndResolve(Class, o);
        injector.setChild(childInjector);
        return childInjector;
    };
    Injector.createAndResolve = function (Class, o) {
        var childInjector = new Injector();
        childInjector.createAndResolve(Class, o);
        return childInjector;
    };
    Injector.initialize = function (t, o) {
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
        throw new Error("Cannot create a instance for '" + stringify(t) + "' because its constructor has more than 20 arguments");
    };
    ;
    return Injector;
})();
exports.Injector = Injector;
//# sourceMappingURL=injector.js.map