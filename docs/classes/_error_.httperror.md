# Class HttpError
 since 1.0.0 class  name HttpException param status code param  param  constructor  description 
HttpException use it in controller actions


### Extends
* Error

## Index

### Constructors
* [constructor](_error_.httperror.md#constructor)

### Properties
* [code](_error_.httperror.md#code)
* [Error](_error_.httperror.md#error)
* [message](_error_.httperror.md#message)
* [name](_error_.httperror.md#name)
* [stack](_error_.httperror.md#stack)

### Methods
* [getCode](_error_.httperror.md#getcode)
* [toString](_error_.httperror.md#tostring)

## Constructors

### new HttpError(code: any, message: any, data: any): [HttpError](_error_.httperror.md)
  
* Defined in [error.ts:13](https://github.com/igorzg/typeix/blob/master/src/error.ts#L13)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| code | any|  |
| message | any|  |
| data | any|  |

#### Returns: [HttpError](_error_.httperror.md)

## Properties

### Private code: any

* Defined in [error.ts:14](https://github.com/igorzg/typeix/blob/master/src/error.ts#L14)


### Static Error: ErrorConstructor

* Defined in D:/Development/Projects/Github/typeix/node_modules/typedoc/node_modules/typescript/lib/lib.d.ts:890


### Static message: string

* Inherited from Error.message
* Defined in D:/Development/Projects/Github/typeix/node_modules/typedoc/node_modules/typescript/lib/lib.d.ts:881


### Static name: string

* Inherited from Error.name
* Defined in D:/Development/Projects/Github/typeix/node_modules/typedoc/node_modules/typescript/lib/lib.d.ts:880


### Static Optional stack: string

* Inherited from Error.stack
* Defined in D:/Development/Projects/Github/typeix/typings/globals/node/index.d.ts:4


## Methods

### getCode(): number
  
* Defined in [error.ts:20](https://github.com/igorzg/typeix/blob/master/src/error.ts#L20)

#### Returns: number

### toString(): string
  
* Defined in [error.ts:24](https://github.com/igorzg/typeix/blob/master/src/error.ts#L24)

#### Returns: string

