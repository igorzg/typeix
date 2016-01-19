function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('reflect-metadata'));
exports.Injectable = function () { return function (token) { return token; }; };
exports.Bootstrap = exports.Injectable;
exports.Component = function (config) {
    return function (token) {
        // Reflect.defineMetadata('annotations', config, token);
        return token;
    };
};
//# sourceMappingURL=decorators.js.map