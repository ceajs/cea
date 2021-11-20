[@ceajs/attendance-plugin](README.md) / [Exports](modules.md) / CheckIn

# Class: CheckIn

Universal Check In helper for `sign` | `attendance`

## Table of contents

### Constructors

- [constructor](classes/CheckIn.md#constructor)

### Properties

- [campusphereHost](classes/CheckIn.md#campuspherehost)
- [checkInType](classes/CheckIn.md#checkintype)
- [headers](classes/CheckIn.md#headers)
- [school](classes/CheckIn.md#school)
- [user](classes/CheckIn.md#user)
- [EXTENSION\_ENCRYPT](classes/CheckIn.md#extension_encrypt)
- [FORMBODY\_ENCRYPT](classes/CheckIn.md#formbody_encrypt)
- [VERSION](classes/CheckIn.md#version)

### Methods

- [grabSignedData](classes/CheckIn.md#grabsigneddata)
- [signInfo](classes/CheckIn.md#signinfo)
- [signTaskDetails](classes/CheckIn.md#signtaskdetails)
- [signWithForm](classes/CheckIn.md#signwithform)
- [extensionEncrypt](classes/CheckIn.md#extensionencrypt)
- [fillExtra](classes/CheckIn.md#fillextra)
- [fixedFloatRight](classes/CheckIn.md#fixedfloatright)
- [formBodyEncrypt](classes/CheckIn.md#formbodyencrypt)
- [signIn](classes/CheckIn.md#signin)

## Constructors

### constructor

• **new CheckIn**(`user`, `checkInType`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `UserConfOpts` |
| `checkInType` | ``"sign"`` \| ``"attendance"`` |

#### Defined in

[index.ts:54](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L54)

## Properties

### campusphereHost

• `Private` `Readonly` **campusphereHost**: `string`

#### Defined in

[index.ts:52](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L52)

___

### checkInType

• `Private` `Readonly` **checkInType**: ``"sign"`` \| ``"attendance"``

#### Defined in

[index.ts:53](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L53)

___

### headers

• `Private` **headers**: `StringKV`

#### Defined in

[index.ts:49](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L49)

___

### school

• `Private` **school**: `SchoolConfOpts`

#### Defined in

[index.ts:51](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L51)

___

### user

• `Private` **user**: `UserConfOpts`

#### Defined in

[index.ts:50](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L50)

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

[index.ts:38](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L38)

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

[index.ts:43](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L43)

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

[index.ts:33](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L33)

## Methods

### grabSignedData

▸ **grabSignedData**(): `Promise`<`undefined` \| `SignTaskDetail`\>

#### Returns

`Promise`<`undefined` \| `SignTaskDetail`\>

#### Defined in

[index.ts:225](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L225)

___

### signInfo

▸ **signInfo**(): `Promise`<`void` \| `SignTaskPerDay`\>

#### Returns

`Promise`<`void` \| `SignTaskPerDay`\>

#### Defined in

[index.ts:67](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L67)

___

### signTaskDetails

▸ **signTaskDetails**(`task`): `Promise`<`SignTaskDetail`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `task` | `SignTask` |

#### Returns

`Promise`<`SignTaskDetail`\>

#### Defined in

[index.ts:210](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L210)

___

### signWithForm

▸ **signWithForm**(`curTask`): `Promise`<`LogInfo`\>

Cookie is preconfigured by singInfo method

#### Parameters

| Name | Type |
| :------ | :------ |
| `curTask` | `SignTask` |

#### Returns

`Promise`<`LogInfo`\>

#### Defined in

[index.ts:101](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L101)

___

### extensionEncrypt

▸ `Static` `Private` **extensionEncrypt**(`body`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `SignExtensionBody` |

#### Returns

`string`

#### Defined in

[index.ts:279](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L279)

___

### fillExtra

▸ `Static` `Private` **fillExtra**(`extraField`): `undefined` \| { `extraFieldItemValue`: `string` ; `extraFieldItemWid`: `string`  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraField` | { `extraFieldItems`: { `content`: `string` ; `isAbnormal`: `boolean` ; `wid`: `string`  }[]  }[] |

#### Returns

`undefined` \| { `extraFieldItemValue`: `string` ; `extraFieldItemWid`: `string`  }[]

#### Defined in

[index.ts:263](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L263)

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

[index.ts:253](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L253)

___

### formBodyEncrypt

▸ `Static` `Private` **formBodyEncrypt**(`body`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `body` | `SignFormBody` |

#### Returns

`string`

#### Defined in

[index.ts:287](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L287)

___

### signIn

▸ `Static` **signIn**(`users`, `checkInType`): `Promise`<``null`` \| `GlobalLogInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `users` | `UserConfOpts`[] |
| `checkInType` | ``"sign"`` \| ``"attendance"`` |

#### Returns

`Promise`<``null`` \| `GlobalLogInfo`\>

#### Defined in

[index.ts:295](https://github.com/ceajs/cea/blob/a82f96f/plugins/check-in-helper/src/index.ts#L295)
