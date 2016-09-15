# Class Request
 since 1.0.0 class  name Request constructor  description 
Request is responsible for handling router result and processing all requests in system
This component is used internally by framework


### Implements
* [IAfterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md)

## Index

### Properties
* [data](_server_request_.request.md#data)
* [eventEmitter](_server_request_.request.md#eventemitter)
* [id](_server_request_.request.md#id)
* [injector](_server_request_.request.md#injector)
* [isCustomError](_server_request_.request.md#iscustomerror)
* [isForwarded](_server_request_.request.md#isforwarded)
* [isForwarder](_server_request_.request.md#isforwarder)
* [logger](_server_request_.request.md#logger)
* [request](_server_request_.request.md#request)
* [response](_server_request_.request.md#response)
* [router](_server_request_.request.md#router)
* [statusCode](_server_request_.request.md#statuscode)
* [url](_server_request_.request.md#url)

### Methods
* [afterConstruct](_server_request_.request.md#afterconstruct)
* [destroy](_server_request_.request.md#destroy)
* [process](_server_request_.request.md#process)
* [render](_server_request_.request.md#render)

## Properties

### Private data: Array<Buffer>
 param  description 
Data received by client on POST, PATCH, PUT requests

* Defined in [server/request.ts:79](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L79)


### Private eventEmitter: EventEmitter
 param  description 
Responsible for handling events

* Defined in [server/request.ts:120](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L120)


### Private id: string
 param  description 
UUID identifier of request

* Defined in [server/request.ts:127](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L127)


### Private injector: [Injector](_injector_injector_.injector.md)
 param  description 
Injector which created request

* Defined in [server/request.ts:96](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L96)


### Private isCustomError: boolean
 param  description 
Value provided by injector which handles custom error responses

* Defined in [server/request.ts:55](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L55)


### Private isForwarded: boolean
 param  description 
Information internally used by request itself on forwarded requests

* Defined in [server/request.ts:63](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L63)


### Private isForwarder: boolean
 param  description 
Information internally used by request itself on forwarded requests

* Defined in [server/request.ts:71](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L71)


### Private logger: [Logger](_logger_logger_.logger.md)
 param  description 
Provided by injector

* Defined in [server/request.ts:104](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L104)


### Private request: IncomingMessage
 param  description 
Value provided by injector which handles request input

* Defined in [server/request.ts:39](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L39)


### Private response: ServerResponse
 param  description 
Value provided by injector which handles response output

* Defined in [server/request.ts:47](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L47)


### Private router: [Router](_router_router_.router.md)
 param  description 
Provided by injector

* Defined in [server/request.ts:112](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L112)


### Private statusCode: number
 param  description 
Request status code default 200

* Defined in [server/request.ts:88](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L88)


### Private url: Url
 param  description 
Parsed request url

* Defined in [server/request.ts:133](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L133)


## Methods

### Private afterConstruct(): void
 since 1.0.0 function  name Request#afterConstruct description 
This function is called by injector after constructor is initialized
  
* Implementation of [IAfterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md).[afterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md#afterconstruct)
* Defined in [server/request.ts:156](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L156)

#### Returns: void

### Private destroy(): void
 since 1.0.0 function  name Request#destroy description 
Destroy all references to free memory
  
* Defined in [server/request.ts:143](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L143)

#### Returns: void

### Private process(): Promise
 since 1.0.0 function  name Request#process description 
Process request logic
  
* Defined in [server/request.ts:201](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L201)

#### Returns: Promise

### Private render(response: string | Buffer): string | Buffer
 since 1.0.0 function  name Request#render description 
This method sends data to client
  
* Defined in [server/request.ts:173](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L173)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| response | string | Buffer|  |

#### Returns: string | Buffer

