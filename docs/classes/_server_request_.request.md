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

* Defined in [server/request.ts:80](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L80)


### Private eventEmitter: EventEmitter
 param  description 
Responsible for handling events

* Defined in [server/request.ts:121](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L121)


### Private id: string
 param  description 
UUID identifier of request

* Defined in [server/request.ts:128](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L128)


### Private injector: [Injector](_injector_injector_.injector.md)
 param  description 
Injector which created request

* Defined in [server/request.ts:97](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L97)


### Private isCustomError: boolean
 param  description 
Value provided by injector which handles custom error responses

* Defined in [server/request.ts:56](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L56)


### Private isForwarded: boolean
 param  description 
Information internally used by request itself on forwarded requests

* Defined in [server/request.ts:64](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L64)


### Private isForwarder: boolean
 param  description 
Information internally used by request itself on forwarded requests

* Defined in [server/request.ts:72](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L72)


### Private logger: [Logger](_logger_logger_.logger.md)
 param  description 
Provided by injector

* Defined in [server/request.ts:105](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L105)


### Private request: IncomingMessage
 param  description 
Value provided by injector which handles request input

* Defined in [server/request.ts:40](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L40)


### Private response: ServerResponse
 param  description 
Value provided by injector which handles response output

* Defined in [server/request.ts:48](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L48)


### Private router: [Router](_router_router_.router.md)
 param  description 
Provided by injector

* Defined in [server/request.ts:113](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L113)


### Private statusCode: number
 param  description 
Request status code default 200

* Defined in [server/request.ts:89](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L89)


### Private url: Url
 param  description 
Parsed request url

* Defined in [server/request.ts:134](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L134)


## Methods

### Private afterConstruct(): void
 since 1.0.0 function  name Request#afterConstruct description 
This function is called by injector after constructor is initialized
  
* Implementation of [IAfterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md).[afterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md#afterconstruct)
* Defined in [server/request.ts:157](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L157)

#### Returns: void

### Private destroy(): void
 since 1.0.0 function  name Request#destroy description 
Destroy all references to free memory
  
* Defined in [server/request.ts:144](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L144)

#### Returns: void

### Private process(): Promise
 since 1.0.0 function  name Request#process description 
Process request logic
  
* Defined in [server/request.ts:202](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L202)

#### Returns: Promise

### Private render(response: string | Buffer): string | Buffer
 since 1.0.0 function  name Request#render description 
This method sends data to client
  
* Defined in [server/request.ts:174](https://github.com/igorzg/typeix/blob/master/src/server/request.ts#L174)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| response | string | Buffer|  |

#### Returns: string | Buffer

