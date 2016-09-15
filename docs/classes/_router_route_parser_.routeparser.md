# Class RouteParser
 since 1.0.0 function  name RouteParser constructor 
 param 
 description 
RouteParser is responsible for parsing routes


## Index

### Constructors
* [constructor](_router_route_parser_.routeparser.md#constructor)

### Properties
* [child](_router_route_parser_.routeparser.md#child)
* [parent](_router_route_parser_.routeparser.md#parent)
* [path](_router_route_parser_.routeparser.md#path)
* [pattern](_router_route_parser_.routeparser.md#pattern)

### Methods
* [createUrl](_router_route_parser_.routeparser.md#createurl)
* [getHead](_router_route_parser_.routeparser.md#gethead)
* [getParams](_router_route_parser_.routeparser.md#getparams)
* [getTail](_router_route_parser_.routeparser.md#gettail)
* [isValid](_router_route_parser_.routeparser.md#isvalid)
* [parse](_router_route_parser_.routeparser.md#parse)
* [toPattern](_router_route_parser_.routeparser.md#topattern)

## Constructors

### new RouteParser(tree: [IUrlTreePath](../interfaces/_interfaces_iroute_.iurltreepath.md), parent?: [RouteParser](_router_route_parser_.routeparser.md)): [RouteParser](_router_route_parser_.routeparser.md)
 since 1.0.0 function  name RouteParser constructor 
 description 
Creates pattern based on path provided example 
let tree = RouteParser.toUrlTree("/<param_a:(\\w+)>-<param_b:([a-zA-Z]+)>-now-<param_c:\\d+>-not/bcd");
let parsedRoute = new RouteParser(tree);
  
* Defined in [router/route-parser.ts:297](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L297)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| tree | [IUrlTreePath](../interfaces/_interfaces_iroute_.iurltreepath.md)|  |
| parent? | [RouteParser](_router_route_parser_.routeparser.md)|  |

#### Returns: [RouteParser](_router_route_parser_.routeparser.md)

## Properties

### child: [RouteParser](_router_route_parser_.routeparser.md)

* Defined in [router/route-parser.ts:208](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L208)


### parent: [RouteParser](_router_route_parser_.routeparser.md)

* Defined in [router/route-parser.ts:209](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L209)


### path: string

* Defined in [router/route-parser.ts:206](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L206)


### pattern: [Pattern](_router_route_parser_.pattern.md)

* Defined in [router/route-parser.ts:207](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L207)


## Methods

### createUrl(params: Object): string
 since 1.0.0 function  name RouteParser#createUrl description 
Create url if params are correct type if params are not valid it throws error throws Error
  
* Defined in [router/route-parser.ts:355](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L355)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| params | Object|  |

#### Returns: string

### Private getHead(): any
 since 1.0.0 function  name RouteParser#getHead description 
Return head RouteParser

  
* Defined in [router/route-parser.ts:400](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L400)

#### Returns: any

### getParams(url: string): Object
 since 1.0.0 function  name RouteParser#getParams description 
Extract params from url throws Error
  
* Defined in [router/route-parser.ts:374](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L374)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| url | string|  |

#### Returns: Object

### Private getTail(): any
 since 1.0.0 function  name RouteParser#getTail description 
Return tail RouteParser

  
* Defined in [router/route-parser.ts:418](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L418)

#### Returns: any

### isValid(url: string): boolean
 since 1.0.0 function  name RouteParser#isValid description 
Check if url is valid
  
* Defined in [router/route-parser.ts:332](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L332)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| url | string|  |

#### Returns: boolean

### Static parse(url: string): [RouteParser](_router_route_parser_.routeparser.md)
 since 1.0.0 function  name RouteParser#parse static 
 description 
Creates url tree which is used by RouteParser for easier pattern creation
 example 
RouteParser.parse("/can<any>one/<name:\\w+>/should<now:\\W+>do-it/<see:(\\w+)>-<nice:([a-zA-Z]+)>-now-<only:\\d+>-not/user/<id:\\d+>");

  
* Defined in [router/route-parser.ts:277](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L277)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| url | string|  |

#### Returns: [RouteParser](_router_route_parser_.routeparser.md)

### Static toPattern(path: string): [Pattern](_router_route_parser_.pattern.md)
 since 1.0.0 function  name RouteParser#toPattern static 
 description 
Creates pattern based on path provided example 
RouteParser.toPattern("<param_a:(\\w+)>-<param_b:([a-zA-Z]+)>-now-<param_c:\\d+>-not");
  
* Defined in [router/route-parser.ts:223](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L223)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| path | string|  |

#### Returns: [Pattern](_router_route_parser_.pattern.md)

