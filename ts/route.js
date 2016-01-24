const methods = [
    'GET', 'HEAD', 'POST', 'PUT', 'DELETE',
    'TRACE', 'OPTIONS', 'CONNECT', 'PATCH'
];
class RouteRule {
    constructor(logger) {
        this.logger = logger;
    }
    parseRequest() {
        return Promise.resolve();
    }
    createUrl() {
        return Promise.resolve();
    }
}
exports.RouteRule = RouteRule;
//# sourceMappingURL=route.js.map