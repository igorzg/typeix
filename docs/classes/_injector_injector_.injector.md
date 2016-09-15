# Class Injector
 since 1.0.0 function  name Injector
 param injector
 description 
Dependency injection for class injection



## Index

### Constructors
* [constructor](_injector_injector_.injector.md#constructor)

### Properties
* [_children](_injector_injector_.injector.md#_children)
* [_providers](_injector_injector_.injector.md#_providers)
* [_uid](_injector_injector_.injector.md#_uid)
* [parent](_injector_injector_.injector.md#parent)

### Methods
* [createAndResolve](_injector_injector_.injector.md#createandresolve)
* [destroy](_injector_injector_.injector.md#destroy)
* [get](_injector_injector_.injector.md#get)
* [has](_injector_injector_.injector.md#has)
* [removeChild](_injector_injector_.injector.md#removechild)
* [set](_injector_injector_.injector.md#set)
* [setChild](_injector_injector_.injector.md#setchild)
* [createAndResolve](_injector_injector_.injector.md#createandresolve-1)
* [createAndResolveChild](_injector_injector_.injector.md#createandresolvechild)

## Constructors

### new Injector(parent?: [Injector](_injector_injector_.injector.md)): [Injector](_injector_injector_.injector.md)
 since 1.0.0 constructor  function  name Injector#constructor description 
Injector constructor
  
* Defined in [injector/injector.ts:91](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L91)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| parent? | [Injector](_injector_injector_.injector.md)|  |

#### Returns: [Injector](_injector_injector_.injector.md)

## Properties

### Private _children: Array<[Injector](_injector_injector_.injector.md)>

* Defined in [injector/injector.ts:21](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L21)


### Private _providers: Map

* Defined in [injector/injector.ts:20](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L20)


### Private _uid: string

* Defined in [injector/injector.ts:19](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L19)


### Private Optional parent: [Injector](_injector_injector_.injector.md)

* Defined in [injector/injector.ts:103](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L103)


## Methods

### createAndResolve(provider: [IProvider](../interfaces/_interfaces_iprovider_.iprovider.md), providers: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>): any
 since 1.0.0 function  name Injector#createAndResolve description 
Creates instance of verified provider and creates instances of current providers and assign it to current injector instance
This method is used internally in most cases you should use static method Injector.createAndResolve or Injector.createAndResolveChild
  
* Defined in [injector/injector.ts:117](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L117)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| provider | [IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)|  |
| providers | Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)>|  |

#### Returns: any

### destroy(): void
 since 1.0.0 function  name Injector#destroy
 description 
Do cleanup on current injector and all children so we are ready for gc this is used internally by framework
  
* Defined in [injector/injector.ts:158](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L158)

#### Returns: void

### get(provider: any, Class?: [IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)): any
 since 1.0.0 function  name Injector#get description 
Gets current Injectable instance throws exception if Injectable class is not created
  
* Defined in [injector/injector.ts:192](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L192)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| provider | any|  |
| Class? | [IProvider](../interfaces/_interfaces_iprovider_.iprovider.md)|  |

#### Returns: any

### has(key: any): boolean
 since 1.0.0 function  name Injector#has description 
Check if Injectable class has instance on current injector
  
* Defined in [injector/injector.ts:178](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L178)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| key | any|  |

#### Returns: boolean

### Private removeChild(injector: [Injector](_injector_injector_.injector.md)): void
 since 1.0.0 function  name Injector#setChild description 
Remove child injector
  
* Defined in [injector/injector.ts:244](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L244)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| injector | [Injector](_injector_injector_.injector.md)|  |

#### Returns: void

### set(key: any, value: Object): void
 since 1.0.0 function  name Injector#set description 
Sets Injectable instance to current injector instance
  
* Defined in [injector/injector.ts:216](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L216)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| key | any|  |
| value | Object|  |

#### Returns: void

### Private setChild(injector: [Injector](_injector_injector_.injector.md)): void
 since 1.0.0 function  name Injector#setChild description 
Append child Injector
  
* Defined in [injector/injector.ts:230](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L230)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| injector | [Injector](_injector_injector_.injector.md)|  |

#### Returns: void

### Static createAndResolve(Class: Function, providers: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md) | Function>): [Injector](_injector_injector_.injector.md)
 since 1.0.0 static  function  name Injector#createAndResolve description 
Static method which creates injector and instance of Injectable class
 example 
\@Injectable()
class MyInjectableClass{
   \@Inject("config")
   private config: Object;
}

let injector = Injector.createAndResolve(
   MyInjectableClass,
   [
     {provide: "config", useValue: {id: 1, message: "This is custom provider for injector"}}
   ]
);
let myInstance = injector.get(MyInjectableClass);
  
* Defined in [injector/injector.ts:87](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L87)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| Class | Function|  |
| providers | Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md) | Function>|  |

#### Returns: [Injector](_injector_injector_.injector.md)
instance


### Static createAndResolveChild(parent: [Injector](_injector_injector_.injector.md), Class: Function, providers: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md) | Function>): [Injector](_injector_injector_.injector.md)
 since 1.0.0 static  function  name Injector#createAndResolveChild description 
Static method which creates child injector on current injector and creates instance of Injectable class
 example 
\@Injectable()
class MyInjectableClass{
   \@Inject("config")
   private config: Object;
}

let parent = new Injector();
let injector = Injector.createAndResolveChild(
   parent,
   MyInjectableClass,
   [
     {provide: "config", useValue: {id: 1, message: "This is custom provider for injector"}}
   ]
);
let myInstance = injector.get(MyInjectableClass);
  
* Defined in [injector/injector.ts:53](https://github.com/igorzg/typeix/blob/master/src/injector/injector.ts#L53)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| parent | [Injector](_injector_injector_.injector.md)|  |
| Class | Function|  |
| providers | Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md) | Function>|  |

#### Returns: [Injector](_injector_injector_.injector.md)
instance


