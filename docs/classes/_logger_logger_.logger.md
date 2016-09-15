# Class Logger
 license Mit Licence 2015 since 1.0.0 name Logger
 constructor  description 
Logger is a component in easy node application.
Logger handler for easy node, there a various type of logs
[INFO, TRACE, DEBUG, WARN, ERROR, FATAL]
By default only ERROR and FATAL are enabled in production mode.
Logger in system is delivered as component example 


## Index

### Constructors
* [constructor](_logger_logger_.logger.md#constructor)

### Properties
* [debugLevel](_logger_logger_.logger.md#debuglevel)
* [enabled](_logger_logger_.logger.md#enabled)
* [hooks](_logger_logger_.logger.md#hooks)
* [levels](_logger_logger_.logger.md#levels)

### Methods
* [addHook](_logger_logger_.logger.md#addhook)
* [debug](_logger_logger_.logger.md#debug)
* [enable](_logger_logger_.logger.md#enable)
* [error](_logger_logger_.logger.md#error)
* [fatal](_logger_logger_.logger.md#fatal)
* [filter](_logger_logger_.logger.md#filter)
* [info](_logger_logger_.logger.md#info)
* [log](_logger_logger_.logger.md#log)
* [printToConsole](_logger_logger_.logger.md#printtoconsole)
* [setDebugLevel](_logger_logger_.logger.md#setdebuglevel)
* [trace](_logger_logger_.logger.md#trace)
* [warn](_logger_logger_.logger.md#warn)

## Constructors

### new Logger(): [Logger](_logger_logger_.logger.md)
  
* Defined in [logger/logger.ts:23](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L23)

#### Returns: [Logger](_logger_logger_.logger.md)

## Properties

### Private debugLevel: number

* Defined in [logger/logger.ts:23](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L23)


### Private enabled: boolean

* Defined in [logger/logger.ts:22](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L22)


### Private hooks: Set

* Defined in [logger/logger.ts:20](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L20)


### Private levels: Array<[Level](_logger_level_.level.md)>

* Defined in [logger/logger.ts:21](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L21)


## Methods

### addHook(callback: Function): void
 since 1.0.0 function  name Logger#addHook description 
Add hook to log output so developer can extend where to store log
  
* Defined in [logger/logger.ts:168](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L168)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| callback | Function|  |

#### Returns: void

### debug(message: any, ...args: Array<any>): boolean
 since 1.0.0 function  name Logger#debug
 description 
Debug
  
* Defined in [logger/logger.ts:104](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L104)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| message | any|  |
| ...args | Array<any>|  |

#### Returns: boolean

### enable(): void
 since 1.0.0 function  name Logger#enable
 description 
enable logger
  
* Defined in [logger/logger.ts:52](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L52)

#### Returns: void

### error(message: any, ...args: Array<any>): boolean
 since 1.0.0 function  name Logger#error
 description 
Log error case
  
* Defined in [logger/logger.ts:128](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L128)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| message | any|  |
| ...args | Array<any>|  |

#### Returns: boolean

### fatal(message: any, ...args: Array<any>): boolean
 since 1.0.0 function  name Logger#fatal
 description 
Fatal error
  
* Defined in [logger/logger.ts:140](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L140)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| message | any|  |
| ...args | Array<any>|  |

#### Returns: boolean

### Private filter(level: number): [Level](_logger_level_.level.md)
 since 1.0.0 function  name Logger#filter description 
Get level name
This is used internally by logger class
  
* Defined in [logger/logger.ts:153](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L153)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| level | number|  |

#### Returns: [Level](_logger_level_.level.md)

### info(message: any, ...args: Array<any>): boolean
 since 1.0.0 function  name Logger#info
 description 
Log info case
  
* Defined in [logger/logger.ts:92](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L92)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| message | any|  |
| ...args | Array<any>|  |

#### Returns: boolean

### Private log(message: any, data: any, level: [Level](_logger_level_.level.md)): boolean
 since 1.0.0 function  name Logger#log description 
Write to file and exec hooks
  
* Defined in [logger/logger.ts:180](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L180)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| message | any|  |
| data | any|  |
| level | [Level](_logger_level_.level.md)|  |

#### Returns: boolean

### printToConsole(): void
 since 1.0.0 function  name Logger#printToConsole
 description 
Print to console logs
  
* Defined in [logger/logger.ts:63](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L63)

#### Returns: void

### setDebugLevel(value: number): void
 since 1.0.0 function  name Logger#setDebugLevel
 description 
Set debug level
  
* Defined in [logger/logger.ts:41](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L41)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| value | number|  |

#### Returns: void

### trace(message: any, ...args: Array<any>): boolean
 since 1.0.0 function  name Logger#trace
 description 
Trace
  
* Defined in [logger/logger.ts:80](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L80)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| message | any|  |
| ...args | Array<any>|  |

#### Returns: boolean

### warn(message: any, ...args: Array<any>): boolean
 since 1.0.0 function  name Logger#warn
 description 
Log warn case
  
* Defined in [logger/logger.ts:116](https://github.com/igorzg/typeix/blob/master/src/logger/logger.ts#L116)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| message | any|  |
| ...args | Array<any>|  |

#### Returns: boolean

