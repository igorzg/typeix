var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('../core');
var assets_1 = require('./components/assets');
var Application = (function () {
    function Application(assets, b, c, a) {
        console.log('arguments', arguments);
    }
    Application = __decorate([
        core_1.Bootstrap(), 
        __metadata('design:paramtypes', [assets_1.Assets, assets_1.A, assets_1.B, assets_1.C])
    ], Application);
    return Application;
})();
exports.Application = Application;
core_1.bootstrap(Application);
//# sourceMappingURL=bootstrap.js.map