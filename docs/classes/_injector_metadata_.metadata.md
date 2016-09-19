# Class Metadata
 since 1.0.0 constructor  function  name Metadata
 description 
Metadata is responsible for getting or setting metadata definitions for some Class
It's crucial for injector


## Index

### Methods
* [defineMetadata](_injector_metadata_.metadata.md#definemetadata)
* [getComponentConfig](_injector_metadata_.metadata.md#getcomponentconfig)
* [getConstructorInjectKeys](_injector_metadata_.metadata.md#getconstructorinjectkeys)
* [getConstructorPrototypeKeys](_injector_metadata_.metadata.md#getconstructorprototypekeys)
* [getConstructorProviders](_injector_metadata_.metadata.md#getconstructorproviders)
* [getMetadata](_injector_metadata_.metadata.md#getmetadata)
* [hasMetadata](_injector_metadata_.metadata.md#hasmetadata)
* [hasProvider](_injector_metadata_.metadata.md#hasprovider)
* [mergeProviders](_injector_metadata_.metadata.md#mergeproviders)
* [setComponentConfig](_injector_metadata_.metadata.md#setcomponentconfig)
* [verifyProvider](_injector_metadata_.metadata.md#verifyprovider)
* [verifyProviders](_injector_metadata_.metadata.md#verifyproviders)

## Methods

### Static defineMetadata(token: Function, name: string, value: any): boolean
 since 1.0.0 static  function  name Metadata#defineMetadata description 
Define metadata to some class
  
* Defined in [injector/metadata.ts:33](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L33)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| token | Function|  |
| name | string|  |
| value | any|  |

#### Returns: boolean
value


### Static getComponentConfig(Class: Function): any
 since 1.0.0 static  function  name Metadata#getComponentConfig description 
Get component config
  
* Defined in [injector/metadata.ts:82](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L82)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| Class | Function|  |

#### Returns: any

### Static getConstructorInjectKeys(Class: Function): Array<any>
 since 1.0.0 static  function  name Metadata#getConstructorInjectKeys description 
Get all metadata on Class constructor so Injector can decide what to do with them
  
* Defined in [injector/metadata.ts:145](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L145)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| Class | Function|  |

#### Returns: Array<any>

### Static getConstructorPrototypeKeys(Class: Function): any
 since 1.0.0 static  function  name Metadata#getConstructorPrototypeKeys description 
Get keys metadata in order to know what Injector should do with them
  
* Defined in [injector/metadata.ts:131](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L131)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| Class | Function|  |

#### Returns: any

### Static getConstructorProviders(Class: Function): Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>
 since 1.0.0 static  function  name Metadata#getConstructorProviders description 
Return constructor providers in order to be delivered new instance to current injectable class
  
* Defined in [injector/metadata.ts:111](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L111)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| Class | Function|  |

#### Returns: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>

### Static getMetadata(token: Function, name: string, defaultValue =  []: Array<any>): any
 since 1.0.0 static  function  name Metadata#getMetadata description 
Get class metadata if not present return defaultValue
  
* Defined in [injector/metadata.ts:68](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L68)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| token | Function|  |
| name | string|  |
| defaultValue =  [] | Array<any>|  |

#### Returns: any

### Static hasMetadata(token: Function, name: string): boolean
 since 1.0.0 static  function  name Metadata#hasMetadata description 
Check if some class has metadata by key
  
* Defined in [injector/metadata.ts:52](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L52)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| token | Function|  |
| name | string|  |

#### Returns: boolean

### Static hasProvider(providers: Array<any>, Class: Function): boolean
 since 1.0.0 static  function  name Metadata#hasProvider description 
Check if some list of providers are containing provider Class
  
* Defined in [injector/metadata.ts:165](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L165)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| providers | Array<any>|  |
| Class | Function|  |

#### Returns: boolean

### Static mergeProviders(a: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>, b: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>): Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>
 since 1.0.0 static  function  name Metadata#mergeProviders description 
Merge two provider definitions, this is used by Injector internally to know what to deliver at what time
  
* Defined in [injector/metadata.ts:185](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L185)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| a | Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>|  |
| b | Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>|  |

#### Returns: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>

### Static setComponentConfig(Class: Function, config: any): void
 since 1.0.0 static  function  name Metadata#setComponentConfig description 
Sets component config
  
* Defined in [injector/metadata.ts:97](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L97)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| Class | Function|  |
| config | any|  |

#### Returns: void

### Static verifyProvider(value: any): [IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)
 since 1.0.0 static  function  name Metadata#verifyProvider description 
Verify provider to be sure that metadata configuration is provided correctly so it can be used by Injector
  
* Defined in [injector/metadata.ts:216](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L216)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| value | any|  |

#### Returns: [IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)

### Static verifyProviders(providers: Array<any>): Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>
 since 1.0.0 static  function  name Metadata#verifyProviders description 
Verify all providers in list
  
* Defined in [injector/metadata.ts:199](https://github.com/igorzg/typeix/blob/master/src/injector/metadata.ts#L199)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| providers | Array<any>|  |

#### Returns: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>

