var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
/**
 * Created by igi on 17/01/16.
 */
var core_1 = require('../../core');
let A = class {
    constructor() {
        this.name = 'aClass';
    }
};
A = __decorate([
    core_1.Component(), 
    __metadata('design:paramtypes', [])
], A);
exports.A = A;
let Assets = class {
    constructor(c) {
        this.asset = 'aAsset';
        console.log('Assets.arg', arguments);
    }
};
Assets = __decorate([
    core_1.Component({
        name: 'assets'
    }), 
    __metadata('design:paramtypes', [A])
], Assets);
exports.Assets = Assets;
let B = class {
    constructor(a) {
        this.bName = 'bname';
        console.log('B.arg', arguments);
    }
};
B = __decorate([
    core_1.Component(), 
    __metadata('design:paramtypes', [A])
], B);
exports.B = B;
let C = class {
    constructor(assets) {
        console.log('C.arg', arguments);
    }
};
C = __decorate([
    core_1.Component(), 
    __metadata('design:paramtypes', [Assets])
], C);
exports.C = C;
//# sourceMappingURL=assets.js.map