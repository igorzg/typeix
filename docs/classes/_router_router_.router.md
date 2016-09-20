# Class Router
 since 1.0.0 class  name Router constructor  description 
Router is a component for handling routing in system.
All routes should be added during bootstrap process example 
import { Bootstrap, Router } from "../core";
import { Assets } from "./components/assets";

\@Bootstrap({
   port: 9000
})
export class Application {
  constructor(assets: Assets, router: Router) {
      router.add()
  }
}


## Index

### Properties
* [injector](_router_router_.router.md#injector)
* [logger](_router_router_.router.md#logger)
* [routes](_router_router_.router.md#routes)

### Methods
* [addRule](_router_router_.router.md#addrule)
* [addRules](_router_router_.router.md#addrules)
* [createUrl](_router_router_.router.md#createurl)
* [parseRequest](_router_router_.router.md#parserequest)
* [prefixSlash](_router_router_.router.md#prefixslash)

## Properties

### Private injector: [Injector](_injector_injector_.injector.md)
Inject injector
* Defined in [router/router.ts:94](https://github.com/igorzg/typeix/blob/master/src/router/router.ts#L94)


### Private logger: [Logger](_logger_logger_.logger.md)
Inject logger
* Defined in [router/router.ts:89](https://github.com/igorzg/typeix/blob/master/src/router/router.ts#L89)


### Private routes: Array<[Route](../interfaces/_interfaces_iroute_.route.md)>
Array of routes definition type {Array}

* Defined in [router/router.ts:99](https://github.com/igorzg/typeix/blob/master/src/router/router.ts#L99)


## Methods

### addRule(Class: [TRoute](../modules/_interfaces_iroute_.md#troute), config: [RouteRuleConfig](../interfaces/_interfaces_iroute_.routeruleconfig.md)): [Route](../interfaces/_interfaces_iroute_.route.md)
 since 1.0.0 function  name Router#addRule description 
Add rule to router
  
* Defined in [router/router.ts:141](https://github.com/igorzg/typeix/blob/master/src/router/router.ts#L141)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| Class | [TRoute](../modules/_interfaces_iroute_.md#troute)|  |
| config | [RouteRuleConfig](../interfaces/_interfaces_iroute_.routeruleconfig.md)|  |

#### Returns: [Route](../interfaces/_interfaces_iroute_.route.md)

### addRules(rules: Array<[RouteRuleConfig](../interfaces/_interfaces_iroute_.routeruleconfig.md)>): void
 since 1.0.0 function  name Router#addRules description 
Add route to routes list.
All routes must be inherited from Route interface.
  
* Defined in [router/router.ts:126](https://github.com/igorzg/typeix/blob/master/src/router/router.ts#L126)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| rules | Array<[RouteRuleConfig](../interfaces/_interfaces_iroute_.routeruleconfig.md)>|  |

#### Returns: void

### createUrl(routeName: string, params: Object): Promise
 since 1.0.0 function  name Router#createUrl description 
Create url based on route and params
  
* Defined in [router/router.ts:187](https://github.com/igorzg/typeix/blob/master/src/router/router.ts#L187)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| routeName | string|  |
| params | Object|  |

#### Returns: Promise

### parseRequest(pathName: string, method: string, headers: [Headers](../interfaces/_interfaces_iroute_.headers.md)): Promise
 since 1.0.0 function  name Router#parseRequest description 
Parse request based on pathName and method
  
* Defined in [router/router.ts:163](https://github.com/igorzg/typeix/blob/master/src/router/router.ts#L163)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| pathName | string|  |
| method | string|  |
| headers | [Headers](../interfaces/_interfaces_iroute_.headers.md)|  |

#### Returns: Promise

### Static Private prefixSlash(value: string): string
 since 1.0.0 function  name Router#prefixSlash static  description 
Prefixes url with starting slash
  
* Defined in [router/router.ts:112](https://github.com/igorzg/typeix/blob/master/src/router/router.ts#L112)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| value | string|  |

#### Returns: string

