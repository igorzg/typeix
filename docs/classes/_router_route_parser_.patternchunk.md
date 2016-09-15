# Class PatternChunk
 since 1.0.0 function  name PatternChunk constructor 
 param  param  param  param 
 description 
Pattern chunk used by pattern


## Index

### Constructors
* [constructor](_router_route_parser_.patternchunk.md#constructor)

### Properties
* [index](_router_route_parser_.patternchunk.md#index)
* [param](_router_route_parser_.patternchunk.md#param)
* [regex](_router_route_parser_.patternchunk.md#regex)
* [replace](_router_route_parser_.patternchunk.md#replace)
* [source](_router_route_parser_.patternchunk.md#source)

### Methods
* [getIndex](_router_route_parser_.patternchunk.md#getindex)
* [getParam](_router_route_parser_.patternchunk.md#getparam)
* [getRegex](_router_route_parser_.patternchunk.md#getregex)
* [getReplaceMatcher](_router_route_parser_.patternchunk.md#getreplacematcher)
* [getSource](_router_route_parser_.patternchunk.md#getsource)

## Constructors

### new PatternChunk(index: number, replace: string, source: string, param?: string): [PatternChunk](_router_route_parser_.patternchunk.md)
  
* Defined in [router/route-parser.ts:24](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L24)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| index | number|  |
| replace | string|  |
| source | string|  |
| param? | string|  |

#### Returns: [PatternChunk](_router_route_parser_.patternchunk.md)

## Properties

### Private index: number

* Defined in [router/route-parser.ts:26](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L26)


### Private Optional param: string

* Defined in [router/route-parser.ts:29](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L29)


### Private regex: any

* Defined in [router/route-parser.ts:24](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L24)


### Private replace: string

* Defined in [router/route-parser.ts:27](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L27)


### Private source: string

* Defined in [router/route-parser.ts:28](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L28)


## Methods

### getIndex(): number
 since 1.0.0 function  name PatternChunk#getIndex
 description 
Get index
  
* Defined in [router/route-parser.ts:53](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L53)

#### Returns: number

### getParam(): string
 since 1.0.0 function  name PatternChunk#getParam
 description 
Get parameter
  
* Defined in [router/route-parser.ts:89](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L89)

#### Returns: string

### getRegex(): any
 since 1.0.0 function  name PatternChunk#getRegex
 description 
Get regex from source
  
* Defined in [router/route-parser.ts:41](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L41)

#### Returns: any

### getReplaceMatcher(): string
 since 1.0.0 function  name PatternChunk#getReplaceMatcher
 description 
Get replace matcher
  
* Defined in [router/route-parser.ts:65](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L65)

#### Returns: string

### getSource(): string
 since 1.0.0 function  name PatternChunk#getSource
 description 
Get source
  
* Defined in [router/route-parser.ts:77](https://github.com/igorzg/typeix/blob/master/src/router/route-parser.ts#L77)

#### Returns: string

