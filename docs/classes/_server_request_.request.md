# Class Request
 since 1.0.0 class  name Request constructor  description 
Request is responsible for handling router result and processing all requests in system
This component is used internally by framework


### Implements
* [IAfterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md)

## Index

### Properties
* [contentType](_server_request_.request.md#contenttype)
* [controllers](_server_request_.request.md#controllers)
* [data](_server_request_.request.md#data)
* [eventEmitter](_server_request_.request.md#eventemitter)
* [id](_server_request_.request.md#id)
* [injector](_server_request_.request.md#injector)
* [isCustomError](_server_request_.request.md#iscustomerror)
* [isForwarded](_server_request_.request.md#isforwarded)
* [isForwarder](_server_request_.request.md#isforwarder)
* [logger](_server_request_.request.md#logger)
* [modules](_server_request_.request.md#modules)
* [request](_server_request_.request.md#request)
* [response](_server_request_.request.md#response)
* [router](_server_request_.request.md#router)
* [statusCode](_server_request_.request.md#statuscode)
* [url](_server_request_.request.md#url)

### Methods
* [afterConstruct](_server_request_.request.md#afterconstruct)
* [destroy](_server_request_.request.md#destroy)
* [handleController](_server_request_.request.md#handlecontroller)
* [handleModule](_server_request_.request.md#handlemodule)
* [process](_server_request_.request.md#process)
* [render](_server_request_.request.md#render)

## Properties

### Private contentType: String
 param  description 
Content type

* Defined in [server/request.ts:147](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L147)


### Private controllers: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md) | Function>
 param  description 
List of controllers assigned to current module

* Defined in [server/request.ts:99](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L99)


### Private data: Array<Buffer>
 param  description 
Data received by client on POST, PATCH, PUT requests

* Defined in [server/request.ts:83](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L83)


### Private eventEmitter: EventEmitter
 param  description 
Responsible for handling events

* Defined in [server/request.ts:139](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L139)


### Private id: string
 param  description 
UUID identifier of request

* Defined in [server/request.ts:155](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L155)


### Private injector: [Injector](_injector_injector_.injector.md)
 param  description 
Injector which created request

* Defined in [server/request.ts:115](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L115)


### Private isCustomError: boolean
 param  description 
Value provided by injector which handles custom error responses

* Defined in [server/request.ts:59](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L59)


### Private isForwarded: boolean
 param  description 
Information internally used by request itself on forwarded requests

* Defined in [server/request.ts:67](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L67)


### Private isForwarder: boolean
 param  description 
Information internally used by request itself on forwarded requests

* Defined in [server/request.ts:75](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L75)


### Private logger: [Logger](_logger_logger_.logger.md)
 param  description 
Provided by injector

* Defined in [server/request.ts:123](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L123)


### Private modules: Array<[IModuleMetadata](../interfaces/_interfaces_imodule_.imodulemetadata.md)>
 param  description 
Lost of modules imported on current module

* Defined in [server/request.ts:91](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L91)


### Private request: IncomingMessage
 param  description 
Value provided by injector which handles request input

* Defined in [server/request.ts:43](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L43)


### Private response: ServerResponse
 param  description 
Value provided by injector which handles response output

* Defined in [server/request.ts:51](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L51)


### Private router: [Router](_router_router_.router.md)
 param  description 
Provided by injector

* Defined in [server/request.ts:131](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L131)


### Private statusCode: number
 param  description 
Request status code default 200

* Defined in [server/request.ts:107](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L107)


### Private url: Url
 param  description 
Parsed request url

* Defined in [server/request.ts:161](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L161)


## Methods

### Private afterConstruct(): void
 since 1.0.0 function  name Request#afterConstruct description 
This function is called by injector after constructor is initialized
  
* Implementation of [IAfterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md).[afterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md#afterconstruct)
* Defined in [server/request.ts:184](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L184)

#### Returns: void

### Private destroy(): void
 since 1.0.0 function  name Request#destroy description 
Destroy all references to free memory
  
* Defined in [server/request.ts:171](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L171)

#### Returns: void

### Private handleController(name: String, actionName: String, resolvedRoute: [ResolvedRoute](../interfaces/_interfaces_iroute_.resolvedroute.md)): Promise
 since 1.0.0 function  name Request#handleController description 
Handle controller instance
  
* Defined in [server/request.ts:228](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L228)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| name | String|  |
| actionName | String|  |
| resolvedRoute | [ResolvedRoute](../interfaces/_interfaces_iroute_.resolvedroute.md)|  |

#### Returns: Promise

### Private handleModule(module: String, name: String, action: String, resolvedRoute: [ResolvedRoute](../interfaces/_interfaces_iroute_.resolvedroute.md)): void
 since 1.0.0 function  name Request#handleModule description 
Handle module instance
  
* Defined in [server/request.ts:282](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L282)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| module | String|  |
| name | String|  |
| action | String|  |
| resolvedRoute | [ResolvedRoute](../interfaces/_interfaces_iroute_.resolvedroute.md)|  |

#### Returns: void

### Private process(): Promise
 since 1.0.0 function  name Request#process description 
Process request logic
  
* Defined in [server/request.ts:299](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L299)

#### Returns: Promise

### Private render(response: string | Buffer): string | Buffer
 since 1.0.0 function  name Request#render description 
This method sends data to client
  
* Defined in [server/request.ts:201](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L201)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| response | string | Buffer|  |

#### Returns: string | Buffer

