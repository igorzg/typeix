# Class Log
 license Mit Licence 2015 since 1.0.0 name Log constructor  description 
Log is private class used by logger to present logs to outputs


## Index

### Constructors
* [constructor](_logger_log_.log.md#constructor)

### Properties
* [created](_logger_log_.log.md#created)
* [data](_logger_log_.log.md#data)
* [level](_logger_log_.log.md#level)
* [message](_logger_log_.log.md#message)

### Methods
* [getLevel](_logger_log_.log.md#getlevel)
* [getName](_logger_log_.log.md#getname)
* [prettify](_logger_log_.log.md#prettify)
* [toString](_logger_log_.log.md#tostring)

## Constructors

### new Log(message: string, data: any, level: [Level](_logger_level_.level.md)): [Log](_logger_log_.log.md)
  
* Defined in [logger/log.ts:14](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L14)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| message | string|  |
| data | any|  |
| level | [Level](_logger_level_.level.md)|  |

#### Returns: [Log](_logger_log_.log.md)

## Properties

### Private created: string

* Defined in [logger/log.ts:14](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L14)


### Private data: any

* Defined in [logger/log.ts:13](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L13)


### Private level: [Level](_logger_level_.level.md)

* Defined in [logger/log.ts:16](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L16)


### Private message: string

* Defined in [logger/log.ts:16](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L16)


## Methods

### getLevel(): number
 since 1.0.0 function  name Log#getLevel
 description 
Get log level name
  
* Defined in [logger/log.ts:38](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L38)

#### Returns: number

### getName(): string
 since 1.0.0 function  name Log#getName
 description 
Get log level name
  
* Defined in [logger/log.ts:27](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L27)

#### Returns: string

### prettify(prettify?: boolean): string
 since 1.0.0 function  name Level#prettify
 description 
Prettify output and print it
  
* Defined in [logger/log.ts:49](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L49)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| prettify? | boolean|  |

#### Returns: string

### toString(): string
 since 1.0.0 function  name Level#toString
 description 
Convert log to string so we can write it on file for example
  
* Defined in [logger/log.ts:73](https://github.com/igorzg/typeix/blob/master/src/logger/log.ts#L73)

#### Returns: string

