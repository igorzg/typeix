# Interface Route
 since 1.0.0 interface  name Route
 description 
Route definition


### Implemented by
* [RouteRule](../classes/_router_route_rule_.routerule.md)

## Index

### Methods
* [createUrl](_interfaces_iroute_.route.md#createurl)
* [parseRequest](_interfaces_iroute_.route.md#parserequest)

## Methods

### createUrl(routeName: string, params: Object): Promise
  
* Defined in [interfaces/iroute.ts:49](https://github.com/igorzg/typeix/blob/master/src/interfaces/iroute.ts#L49)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| routeName | string|  |
| params | Object|  |

#### Returns: Promise

### parseRequest(pathName: string, method: string, headers: [Headers](_interfaces_iroute_.headers.md)): Promise
  
* Defined in [interfaces/iroute.ts:48](https://github.com/igorzg/typeix/blob/master/src/interfaces/iroute.ts#L48)


#### Parameters

| Name | Type | Description |
| ---- | ---- | ---- |
| pathName | string|  |
| method | string|  |
| headers | [Headers](_interfaces_iroute_.headers.md)|  |

#### Returns: Promise

