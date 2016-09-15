# Class RouteRule
 since 1.0.0 function  name RouteRule constructor 
 param 
 description 
Route rule provider is used by router to parse request and create route url


### Implements
* [Route](../interfaces/_interfaces_iroute_.route.md)
* [IAfterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md)

## Index

### Properties
* [config](_router_route_rule_.routerule.md#config)
* [routeParser](_router_route_rule_.routerule.md#routeparser)

### Methods
* [afterConstruct](_router_route_rule_.routerule.md#afterconstruct)
* [createUrl](_router_route_rule_.routerule.md#createurl)
* [parseRequest](_router_route_rule_.routerule.md#parserequest)

## Properties

### Private config: [RouteRuleConfig](../interfaces/_interfaces_iroute_.routeruleconfig.md)

* Defined in [router/route-rule.ts:22](https://github.com/igorzg/typeix/blob/master/src/router/route-rule.ts#L22)


### Private routeParser: [RouteParser](_router_route_parser_.routeparser.md)

* Defined in [router/route-rule.ts:23](https://github.com/igorzg/typeix/blob/master/src/router/route-rule.ts#L23)


## Methods

### Private afterConstruct(): void
 since 1.0.0 function  name RouteRule#afterConstruct description 
After construct apply config data
  
* Implementation of [IAfterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md).[afterConstruct](../interfaces/_interfaces_iprovider_.iafterconstruct.md#afterconstruct)
* Defined in [router/route-rule.ts:33](https://github.com/igorzg/typeix/blob/master/src/router/route-rule.ts#L33)

#### Returns: void

### Private createUrl(routeName: string, params: Object): Promise
 since 1.0.0 function  name RouteRule#parseRequest static 
 description 
It try's to create url
  
* Implementation of [Route](../interfaces/_interfaces_iroute_.route.md).[createUrl](../interfaces/_interfaces_iroute_.route.md#createurl)
* Defined in [router/route-rule.ts:77](https://github.com/igorzg/typeix/blob/master/src/router/route-rule.ts#L77)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| routeName | string|  |
| params | Object|  |

#### Returns: Promise

### Private parseRequest(path: string, method: string, headers: [Headers](../interfaces/_interfaces_iroute_.headers.md)): Promise
 since 1.0.0 function  name RouteRule#parseRequest static 
 description 
Parse request is used internally by Router to be able to parse request
  
* Implementation of [Route](../interfaces/_interfaces_iroute_.route.md).[parseRequest](../interfaces/_interfaces_iroute_.route.md#parserequest)
* Defined in [router/route-rule.ts:51](https://github.com/igorzg/typeix/blob/master/src/router/route-rule.ts#L51)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| path | string|  |
| method | string|  |
| headers | [Headers](../interfaces/_interfaces_iroute_.headers.md)|  |

#### Returns: Promise

