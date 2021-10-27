[cea-check-in](../README.md) / [Exports](../modules.md) / CheckIn

# Class: CheckIn

## Table of contents

### Constructors

- [constructor](CheckIn.md#constructor)

### Properties

- [headers](CheckIn.md#headers)
- [school](CheckIn.md#school)
- [user](CheckIn.md#user)
- [EXTENSION\_ENCRYPT](CheckIn.md#extension_encrypt)
- [FORMBODY\_ENCRYPT](CheckIn.md#formbody_encrypt)
- [VERSION](CheckIn.md#version)

### Methods

- [signInfo](CheckIn.md#signinfo)
- [signWithForm](CheckIn.md#signwithform)
- [extensionEncrypt](CheckIn.md#extensionencrypt)
- [fillExtra](CheckIn.md#fillextra)
- [fixedFloatRight](CheckIn.md#fixedfloatright)
- [formBodyEncrypt](CheckIn.md#formbodyencrypt)

## Constructors

### constructor

• **new CheckIn**(`user`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `UserConfOpts` |

#### Defined in

[index.ts:49](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L49)

## Properties

### headers

• `Private` **headers**: `StringKV`

#### Defined in

[index.ts:46](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L46)

___

### school

• `Private` **school**: `SchoolConfOpts`

#### Defined in

[index.ts:48](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L48)

___

### user

• `Private` **user**: `UserConfOpts`

#### Defined in

[index.ts:47](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L47)

___

### EXTENSION\_ENCRYPT

▪ `Static` `Readonly` **EXTENSION\_ENCRYPT**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `algo` | `string` |
| `iv` | `Buffer` |
| `key` | `string` |

#### Defined in

[index.ts:35](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L35)

___

### FORMBODY\_ENCRYPT

▪ `Static` `Readonly` **FORMBODY\_ENCRYPT**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `algo` | `string` |
| `iv` | `Buffer` |
| `key` | `string` |

#### Defined in

[index.ts:40](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L40)

___

### VERSION

▪ `Static` `Readonly` **VERSION**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `app` | `string` |
| `calVersion` | `string` |
| `version` | `string` |

#### Defined in

[index.ts:30](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L30)

## Methods

### signInfo

▸ **signInfo**(): `Promise`<`void` \| [`AllSignTasks`](../modules/CheckInTypes.md#allsigntasks)\>

#### Returns

`Promise`<`void` \| [`AllSignTasks`](../modules/CheckInTypes.md#allsigntasks)\>

#### Defined in

[index.ts:60](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L60)

___

### signWithForm

▸ **signWithForm**(`curTask`): `Promise`<[`LogInfo`](../modules/CheckInTypes.md#loginfo)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `curTask` | [`SignTask`](../modules/CheckInTypes.md#signtask) |

#### Returns

`Promise`<[`LogInfo`](../modules/CheckInTypes.md#loginfo)\>

#### Defined in

[index.ts:87](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L87)

___

### extensionEncrypt

▸ `Static` `Private` **extensionEncrypt**(`body`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | [`SignExtensionBody`](../modules/CheckInTypes.md#signextensionbody) |

#### Returns

`string`

#### Defined in

[index.ts:219](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L219)

___

### fillExtra

▸ `Static` `Private` **fillExtra**(`extraField`): { `extraFieldItemValue`: `string` ; `extraFieldItemWid`: `string`  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraField` | { `extraFieldItems`: { `content`: `string` ; `isAbnormal`: `boolean` ; `wid`: `string`  }[]  }[] |

#### Returns

{ `extraFieldItemValue`: `string` ; `extraFieldItemWid`: `string`  }[]

#### Defined in

[index.ts:203](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L203)

___

### fixedFloatRight

▸ `Static` `Private` **fixedFloatRight**(`floatStr`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `floatStr` | `string` |

#### Returns

`number`

#### Defined in

[index.ts:193](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L193)

___

### formBodyEncrypt

▸ `Static` `Private` **formBodyEncrypt**(`body`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | [`SignFormBody`](../modules/CheckInTypes.md#signformbody) |

#### Returns

`string`

#### Defined in

[index.ts:227](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/index.ts#L227)
