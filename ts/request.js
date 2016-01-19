var core_1 = require('./core');
var Request = (function () {
    function Request(request, response, injector, logger, router) {
        this.id = core_1.uuid();
        this.isCustomError = false;
        this.isForwarded = false;
        this.isForwarder = false;
        logger.info('Request.args', request.url, router);
        response.end('NICE');
    }
    return Request;
})();
exports.Request = Request;
//# sourceMappingURL=request.js.map