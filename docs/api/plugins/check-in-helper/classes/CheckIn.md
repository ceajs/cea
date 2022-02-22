[@ceajs/check-in-helper](../README.md) / [Exports](../modules.md) / CheckIn

# Class: CheckIn

Universal Check In helper for `sign` | `attendance`

## Table of contents

### Constructors

- [constructor](CheckIn.md#constructor)

### Properties

- [campusphereHost](CheckIn.md#campuspherehost)
- [checkInType](CheckIn.md#checkintype)
- [headers](CheckIn.md#headers)
- [school](CheckIn.md#school)
- [user](CheckIn.md#user)
- [EXTENSION\_ENCRYPT](CheckIn.md#extension_encrypt)
- [FORMBODY\_ENCRYPT](CheckIn.md#formbody_encrypt)
- [VERSION](CheckIn.md#version)

### Methods

- [grabSignedData](CheckIn.md#grabsigneddata)
- [signInfo](CheckIn.md#signinfo)
- [signTaskDetails](CheckIn.md#signtaskdetails)
- [signWithForm](CheckIn.md#signwithform)
- [extensionEncrypt](CheckIn.md#extensionencrypt)
- [fillExtra](CheckIn.md#fillextra)
- [fixedFloatRight](CheckIn.md#fixedfloatright)
- [formBodyEncrypt](CheckIn.md#formbodyencrypt)
- [getLatestValidDateMonth](CheckIn.md#getlatestvaliddatemonth)
- [signIn](CheckIn.md#signin)

## Constructors

### constructor

• **new CheckIn**(`user`, `checkInType`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `UserConfOpts` |
| `checkInType` | ``"sign"`` \| ``"attendance"`` |

#### Defined in

[index.ts:54](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L54)

## Properties

### campusphereHost

• `Private` `Readonly` **campusphereHost**: `string`

#### Defined in

[index.ts:52](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L52)

___

### checkInType

• `Private` `Readonly` **checkInType**: ``"sign"`` \| ``"attendance"``

#### Defined in

[index.ts:53](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L53)

___

### headers

• `Private` **headers**: `StringKV`

#### Defined in

[index.ts:49](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L49)

___

### school

• `Private` **school**: `SchoolConfOpts`

#### Defined in

[index.ts:51](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L51)

___

### user

• `Private` **user**: `UserConfOpts`

#### Defined in

[index.ts:50](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L50)

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

[index.ts:38](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L38)

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

[index.ts:43](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L43)

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

[index.ts:33](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L33)

## Methods

### grabSignedData

▸ **grabSignedData**(): `Promise`<``null`` \| `SignTaskDetail`\>

#### Returns

`Promise`<``null`` \| `SignTaskDetail`\>

#### Defined in

[index.ts:242](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L242)

___

### signInfo

▸ **signInfo**(): `Promise`<`void` \| `SignTaskPerDay`\>

#### Returns

`Promise`<`void` \| `SignTaskPerDay`\>

#### Defined in

[index.ts:67](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L67)

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

[index.ts:227](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L227)

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

[index.ts:101](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L101)

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

[index.ts:337](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L337)

___

### fillExtra

▸ `Static` `Private` **fillExtra**(`extraField`, `signedTemplate`): `undefined` \| ``null`` \| { `extraFieldItemValue`: `string` ; `extraFieldItemWid`: `string`  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraField` | { `extraFieldItems`: { `content`: `string` ; `isAbnormal`: `boolean` ; `isSelected`: `boolean` ; `value`: `string` ; `wid`: `string`  }[] ; `title?`: `string`  }[] |
| `signedTemplate` | `SignTaskDetail` |

#### Returns

`undefined` \| ``null`` \| { `extraFieldItemValue`: `string` ; `extraFieldItemWid`: `string`  }[]

#### Defined in

[index.ts:299](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L299)

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

[index.ts:289](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L289)

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

[index.ts:345](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L345)

___

### getLatestValidDateMonth

▸ `Static` `Private` **getLatestValidDateMonth**(): `string`

#### Returns

`string`

#### Defined in

[index.ts:275](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L275)

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

[index.ts:353](https://github.com/ceajs/cea/blob/3498600/src/plugins/check-in-helper/src/index.ts#L353)
