[cea-check-in](../README.md) / [Exports](../modules.md) / CheckIn

# Class: CheckIn

## Table of contents

### Constructors

- [constructor](checkin.md#constructor)

### Properties

- [headers](checkin.md#headers)
- [school](checkin.md#school)
- [user](checkin.md#user)

### Methods

- [decrypt](checkin.md#decrypt)
- [encrypt](checkin.md#encrypt)
- [extention](checkin.md#extention)
- [fillExtra](checkin.md#fillextra)
- [fixedFloatRight](checkin.md#fixedfloatright)
- [signInfo](checkin.md#signinfo)
- [signWithForm](checkin.md#signwithform)

## Constructors

### constructor

\+ **new CheckIn**(`user`: UserConfOpts): [*CheckIn*](checkin.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | UserConfOpts |

**Returns:** [*CheckIn*](checkin.md)

Defined in: [index.ts:31](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L31)

## Properties

### headers

• `Private` **headers**: StringKV

Defined in: [index.ts:29](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L29)

___

### school

• `Private` **school**: SchoolConfOpts

Defined in: [index.ts:31](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L31)

___

### user

• `Private` **user**: UserConfOpts

Defined in: [index.ts:30](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L30)

## Methods

### decrypt

▸ `Private` **decrypt**(): *void*

**Returns:** *void*

Defined in: [index.ts:195](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L195)

___

### encrypt

▸ `Private` **encrypt**(`ce`: CpdailyExtension): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `ce` | CpdailyExtension |

**Returns:** *string*

Defined in: [index.ts:183](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L183)

___

### extention

▸ `Private` **extention**(`form`: SignForm): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `form` | SignForm |

**Returns:** *string*

Defined in: [index.ts:169](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L169)

___

### fillExtra

▸ `Private` **fillExtra**(`extraField`: { `extraFieldItems`: { `content`: *string* ; `isAbnormal`: *boolean* ; `wid`: *string*  }[]  }[]): { `extraFieldItemValue`: *string* ; `extraFieldItemWid`: *string*  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraField` | { `extraFieldItems`: { `content`: *string* ; `isAbnormal`: *boolean* ; `wid`: *string*  }[]  }[] |

**Returns:** { `extraFieldItemValue`: *string* ; `extraFieldItemWid`: *string*  }[]

Defined in: [index.ts:152](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L152)

___

### fixedFloatRight

▸ `Private` **fixedFloatRight**(`floatStr`: *string*): *number*

#### Parameters

| Name | Type |
| :------ | :------ |
| `floatStr` | *string* |

**Returns:** *number*

Defined in: [index.ts:142](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L142)

___

### signInfo

▸ **signInfo**(): *Promise*<void \| AllSignTasks\>

**Returns:** *Promise*<void \| AllSignTasks\>

Defined in: [index.ts:43](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L43)

___

### signWithForm

▸ **signWithForm**(`curTask`: SignTask): *Promise*<LogInfo\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `curTask` | SignTask |

**Returns:** *Promise*<LogInfo\>

Defined in: [index.ts:70](https://github.com/ceajs/cea/blob/9a35a33/plugins/check-in/src/index.ts#L70)
