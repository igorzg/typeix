# Class Pattern
 since 1.0.0 function  name Pattern constructor 
 param  param  param 
 description 
Route match pattern


## Index

### Constructors
* [constructor](_router_route_parser_.pattern.md#constructor)

### Properties
* [chunks](_router_route_parser_.pattern.md#chunks)
* [path](_router_route_parser_.pattern.md#path)
* [regex](_router_route_parser_.pattern.md#regex)

### Methods
* [getChunkKey](_router_route_parser_.pattern.md#getchunkkey)
* [getChunkKeys](_router_route_parser_.pattern.md#getchunkkeys)
* [getParams](_router_route_parser_.pattern.md#getparams)
* [isValid](_router_route_parser_.pattern.md#isvalid)
* [normalizePath](_router_route_parser_.pattern.md#normalizepath)

## Constructors

### new Pattern(path: string, regex: RegExp, chunks: Array<[PatternChunk](_router_route_parser_.patternchunk.md)>): [Pattern](_router_route_parser_.pattern.md)
  
* Defined in [router/route-parser.ts:106](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L106)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| path | string|  |
| regex | RegExp|  |
| chunks | Array<[PatternChunk](_router_route_parser_.patternchunk.md)>|  |

#### Returns: [Pattern](_router_route_parser_.pattern.md)

## Properties

### Private chunks: Array<[PatternChunk](_router_route_parser_.patternchunk.md)>

* Defined in [router/route-parser.ts:109](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L109)


### Private path: string

* Defined in [router/route-parser.ts:107](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L107)


### Private regex: RegExp

* Defined in [router/route-parser.ts:108](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L108)


## Methods

### getChunkKey(index: number): string
 since 1.0.0 function  name Pattern#getChunkKey description 
Get chunk key name by chunk index
  
* Defined in [router/route-parser.ts:159](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L159)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| index | number|  |

#### Returns: string

### getChunkKeys(): Array<string>
 since 1.0.0 function  name Pattern#getChunkKeys
 description 
Get all chunk keys
  
* Defined in [router/route-parser.ts:146](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L146)

#### Returns: Array<string>

### getParams(path: string): Object
 since 1.0.0 function  name Pattern#getParams description 
Extract params from url
  
* Defined in [router/route-parser.ts:172](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L172)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| path | string|  |

#### Returns: Object

### isValid(path: string): boolean
 since 1.0.0 function  name Pattern#isValid description 
Check if path is valid
  
* Defined in [router/route-parser.ts:189](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L189)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| path | string|  |

#### Returns: boolean

### normalizePath(params: Object): string
 since 1.0.0 function  name Pattern#normalizePath
 description 
Creates path from chunks throws error if no param is correct data type or if it dosen't exist
 throws Error
  
* Defined in [router/route-parser.ts:122](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L122)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| params | Object|  |

#### Returns: string

