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
var core_1 = require('./core');
class Request {
    constructor(request, response, injector, logger, router) {
        this.id = core_1.uuid();
        this.isCustomError = false;
        this.isForwarded = false;
        this.isForwarder = false;
        logger.info('Request.args', request.url, router);
        response.end('NICE');
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map