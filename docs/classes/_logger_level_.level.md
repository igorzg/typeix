# Class Level
 license Mit Licence 2015 since 1.0.0 name Level constructor  description 
Level is private class used by logger to define log levels


## Index

### Constructors
* [constructor](_logger_level_.level.md#constructor)

### Properties
* [callback](_logger_level_.level.md#callback)
* [level](_logger_level_.level.md#level)
* [name](_logger_level_.level.md#name)

### Methods
* [exec](_logger_level_.level.md#exec)
* [getLevel](_logger_level_.level.md#getlevel)
* [getName](_logger_level_.level.md#getname)

## Constructors

### new Level(name: string, level: number, callback: Function): [Level](_logger_level_.level.md)
  
* Defined in [logger/level.ts:10](https://github.com/igorzg/typeix/blob/master/src/logger/level.ts#L10)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| name | string|  |
| level | number|  |
| callback | Function|  |

#### Returns: [Level](_logger_level_.level.md)

## Properties

### Private callback: Function

* Defined in [logger/level.ts:13](https://github.com/igorzg/typeix/blob/master/src/logger/level.ts#L13)


### Private level: number

* Defined in [logger/level.ts:12](https://github.com/igorzg/typeix/blob/master/src/logger/level.ts#L12)


### Private name: string

* Defined in [logger/level.ts:11](https://github.com/igorzg/typeix/blob/master/src/logger/level.ts#L11)


## Methods

### exec(...args: Array<any>): any
 since 1.0.0 function  name Level#exec
 description 
Execute hook
  
* Defined in [logger/level.ts:45](https://github.com/igorzg/typeix/blob/master/src/logger/level.ts#L45)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| ...args | Array<any>|  |

#### Returns: any

### getLevel(): number
 since 1.0.0 function  name Level#getLevel
 description 
Get level value
  
* Defined in [logger/level.ts:34](https://github.com/igorzg/typeix/blob/master/src/logger/level.ts#L34)

#### Returns: number

### getName(): string
 since 1.0.0 function  name Level#getName
 description 
Get level name
  
* Defined in [logger/level.ts:23](https://github.com/igorzg/typeix/blob/master/src/logger/level.ts#L23)

#### Returns: string

