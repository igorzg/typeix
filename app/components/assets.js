var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by igi on 17/01/16.
 */
var core_1 = require('../../core');
var A = (function () {
    function A() {
        this.name = 'aClass';
    }
    A = __decorate([
        core_1.Component(), 
        __metadata('design:paramtypes', [])
    ], A);
    return A;
})();
exports.A = A;
var Assets = (function () {
    function Assets(c) {
        this.asset = 'aAsset';
        console.log('Assets.arg', arguments);
    }
    Assets = __decorate([
        core_1.Component({
            name: 'assets'
        }), 
        __metadata('design:paramtypes', [A])
    ], Assets);
    return Assets;
})();
exports.Assets = Assets;
var B = (function () {
    function B(a) {
        this.bName = 'bname';
        console.log('B.arg', arguments);
    }
    B = __decorate([
        core_1.Component(), 
        __metadata('design:paramtypes', [A])
    ], B);
    return B;
})();
exports.B = B;
var C = (function () {
    function C(assets) {
        console.log('C.arg', arguments);
    }
    C = __decorate([
        core_1.Component(), 
        __metadata('design:paramtypes', [Assets])
    ], C);
    return C;
})();
exports.C = C;
//# sourceMappingURL=assets.js.map