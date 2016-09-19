# External module "injector/decorators"


## Index

### Functions
* [Action](_injector_decorators_.md#action)
* [Controller](_injector_decorators_.md#controller)
* [Inject](_injector_decorators_.md#inject)
* [Injectable](_injector_decorators_.md#injectable)
* [Produces](_injector_decorators_.md#produces)
* [Provider](_injector_decorators_.md#provider)

## Functions

### Action(name: string): (Anonymous function)
Action decorator  
* Defined in [injector/decorators.ts:133](https://github.com/igorzg/typeix/blob/master/src/injector/decorators.ts#L133)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| name | string|  |

#### Returns: (Anonymous function)

### Controller(config: [IControllerMetadata](../interfaces/_interfaces_icontroller_.icontrollermetadata.md)): (Anonymous function)
Controller  
* Defined in [injector/decorators.ts:113](https://github.com/igorzg/typeix/blob/master/src/injector/decorators.ts#L113)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| config | [IControllerMetadata](../interfaces/_interfaces_icontroller_.icontrollermetadata.md)|  |

#### Returns: (Anonymous function)



### Inject(value: Function | string, isMutable?: boolean): (Anonymous function)
  
* Defined in [injector/decorators.ts:26](https://github.com/igorzg/typeix/blob/master/src/injector/decorators.ts#L26)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| value | Function | string|  |
| isMutable? | boolean|  |

#### Returns: (Anonymous function)

### Injectable(): (Anonymous function)
  
* Defined in [injector/decorators.ts:99](https://github.com/igorzg/typeix/blob/master/src/injector/decorators.ts#L99)

#### Returns: (Anonymous function)

### Produces(name: string): (Anonymous function)
Produces response type  
* Defined in [injector/decorators.ts:150](https://github.com/igorzg/typeix/blob/master/src/injector/decorators.ts#L150)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| name | string|  |

#### Returns: (Anonymous function)

### Provider(config: Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md) | Function>): (Anonymous function)
  
* Defined in [injector/decorators.ts:65](https://github.com/igorzg/typeix/blob/master/src/injector/decorators.ts#L65)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| config | Array<[IProvider](../interfaces/_interfaces_iprovider_.iprovider.md) | Function>|  |

#### Returns: (Anonymous function)

