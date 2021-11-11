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

[index.ts:50](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L50)

## Properties

### headers

• `Private` **headers**: `StringKV`

#### Defined in

[index.ts:47](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L47)

___

### school

• `Private` **school**: `SchoolConfOpts`

#### Defined in

[index.ts:49](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L49)

___

### user

• `Private` **user**: `UserConfOpts`

#### Defined in

[index.ts:48](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L48)

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

[index.ts:36](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L36)

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

[index.ts:41](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L41)

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

[index.ts:31](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L31)

## Methods

### signInfo

▸ **signInfo**(): `Promise`<`void` \| [`AllSignTasks`](../modules/CheckInTypes.md#allsigntasks)\>

#### Returns

`Promise`<`void` \| [`AllSignTasks`](../modules/CheckInTypes.md#allsigntasks)\>

#### Defined in

[index.ts:61](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L61)

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

[index.ts:88](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L88)

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

[index.ts:220](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L220)

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

[index.ts:204](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L204)

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

[index.ts:194](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L194)

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

[index.ts:228](https://github.com/ceajs/cea/blob/137f0b9/plugins/check-in/src/index.ts#L228)
