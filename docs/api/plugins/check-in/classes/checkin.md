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

Defined in: [src/index.ts:30](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L30)

## Properties

### headers

• `Private` **headers**: StringKV

Defined in: [src/index.ts:28](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L28)

___

### school

• `Private` **school**: SchoolConfOpts

Defined in: [src/index.ts:30](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L30)

___

### user

• `Private` **user**: UserConfOpts

Defined in: [src/index.ts:29](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L29)

## Methods

### decrypt

▸ `Private` **decrypt**(): *void*

**Returns:** *void*

Defined in: [src/index.ts:190](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L190)

___

### encrypt

▸ `Private` **encrypt**(`ce`: CpdailyExtension): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `ce` | CpdailyExtension |

**Returns:** *string*

Defined in: [src/index.ts:178](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L178)

___

### extention

▸ `Private` **extention**(`form`: SignForm): *string*

#### Parameters

| Name | Type |
| :------ | :------ |
| `form` | SignForm |

**Returns:** *string*

Defined in: [src/index.ts:164](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L164)

___

### fillExtra

▸ `Private` **fillExtra**(`extraField`: { `extraFieldItems`: { `content`: *string* ; `isAbnormal`: *boolean* ; `wid`: *string*  }[]  }[]): { `extraFieldItemValue`: *string* ; `extraFieldItemWid`: *string*  }[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `extraField` | { `extraFieldItems`: { `content`: *string* ; `isAbnormal`: *boolean* ; `wid`: *string*  }[]  }[] |

**Returns:** { `extraFieldItemValue`: *string* ; `extraFieldItemWid`: *string*  }[]

Defined in: [src/index.ts:147](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L147)

___

### signInfo

▸ **signInfo**(): *Promise*<void \| SignTask\>

**Returns:** *Promise*<void \| SignTask\>

Defined in: [src/index.ts:42](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L42)

___

### signWithForm

▸ **signWithForm**(`curTask`: SignTask): *Promise*<LogInfo\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `curTask` | SignTask |

**Returns:** *Promise*<LogInfo\>

Defined in: [src/index.ts:72](https://github.com/beetcb/cea/blob/48b4d03/plugins/check-in/src/index.ts#L72)
