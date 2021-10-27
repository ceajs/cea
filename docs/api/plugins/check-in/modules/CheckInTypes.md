[cea-check-in](../README.md) / [Exports](../modules.md) / CheckInTypes

# Namespace: CheckInTypes

## Table of contents

### Enumerations

- [LogInfoKeys](../enums/CheckInTypes.LogInfoKeys.md)

### Type aliases

- [AllSignTasks](CheckInTypes.md#allsigntasks)
- [GlobalLogInfo](CheckInTypes.md#globalloginfo)
- [LogInfo](CheckInTypes.md#loginfo)
- [PostFormBody](CheckInTypes.md#postformbody)
- [SignExtensionBody](CheckInTypes.md#signextensionbody)
- [SignFormBody](CheckInTypes.md#signformbody)
- [SignHashBody](CheckInTypes.md#signhashbody)
- [SignTask](CheckInTypes.md#signtask)
- [SignTaskDetail](CheckInTypes.md#signtaskdetail)

## Type aliases

### AllSignTasks

Ƭ **AllSignTasks**: { [key in "unSignedTasks" \| "signedTasks" \| "leaveTasks"]: SignTask[] }

#### Defined in

[types.ts:1](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L1)

___

### GlobalLogInfo

Ƭ **GlobalLogInfo**: `Object`

#### Index signature

▪ [key: `string`]: [`LogInfo`](CheckInTypes.md#loginfo)

#### Defined in

[types.ts:82](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L82)

___

### LogInfo

Ƭ **LogInfo**: { [K in LogInfoKeys]?: string }

#### Defined in

[types.ts:78](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L78)

___

### PostFormBody

Ƭ **PostFormBody**: `Object`

用于提交签到的对象

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `appVersion` | `string` | 应用版本 |
| `bodyString` | `string` | 加密后的 SignFormBody |
| `calVersion` | `string` | 版本号:来源未知 |
| `deviceId` | `string` | 设备唯一标识符 |
| `lat` | `number` | 签到维度 |
| `lon` | `number` | 签到经度 |
| `model` | `string` | 手机型号 |
| `sign` | `string` | 由 SignHashBody 序列字符 MD5 Hash 处理得到 |
| `systemName` | `string` | 手机系统名 |
| `systemVersion` | `string` | 手机系统版本 |
| `userId` | `string` | 用户学号 |
| `version` | `string` | 版本号:来源未知 |

#### Defined in

[types.ts:42](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L42)

___

### SignExtensionBody

Ƭ **SignExtensionBody**: `Omit`<[`SignHashBody`](CheckInTypes.md#signhashbody), ``"bodyString"``\>

用于构造 Cpdaily_Extension Header 字符的对象

#### Defined in

[types.ts:71](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L71)

___

### SignFormBody

Ƭ **SignFormBody**: `Object`

用于记录签到表单的对象

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abnormalReason` | `string` |
| `extraFieldItems` | { `extraFieldItemValue`: `string` ; `extraFieldItemWid`: `string`  }[] |
| `isMalposition` | ``1`` \| ``0`` |
| `isNeedExtra` | `string` |
| `latitude` | `number` |
| `longitude` | `number` |
| `position` | `string` |
| `signInstanceWid` | `string` |
| `signPhotoUrl` | `string` |
| `uaIsCpadaily` | ``true`` |

#### Defined in

[types.ts:25](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L25)

___

### SignHashBody

Ƭ **SignHashBody**: `Omit`<[`PostFormBody`](CheckInTypes.md#postformbody), ``"sign"`` \| ``"calVersion"`` \| ``"version"``\>

用于构造 Sign Hash 字符的对象

#### Defined in

[types.ts:69](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L69)

___

### SignTask

Ƭ **SignTask**: { [K in "signInstanceWid" \| "signWid" \| "taskName"]: string }

#### Defined in

[types.ts:5](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L5)

___

### SignTaskDetail

Ƭ **SignTaskDetail**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `extraField` | { `extraFieldItems`: { `content`: `string` ; `isAbnormal`: `boolean` ; `wid`: `string`  }[]  }[] |
| `isNeedExtra` | `string` |
| `latitude` | `string` |
| `longitude` | `string` |
| `signPlaceSelected` | { `latitude`: `string` ; `longitude`: `string`  }[] |
| `signedStuInfo` | `Object` |
| `signedStuInfo.userName` | `string` |

#### Defined in

[types.ts:9](https://github.com/ceajs/cea/blob/08338e7/plugins/check-in/src/types.ts#L9)
