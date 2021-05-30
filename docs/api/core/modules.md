[cea-core](README.md) / Exports

# cea-core

## Table of contents

### Enumerations

- [CampusphereEndpoint](enums/campusphereendpoint.md)

### Interfaces

- [FetchCookieOptions](interfaces/fetchcookieoptions.md)

### Type aliases

- [CookieMap](modules.md#cookiemap)
- [CookieRawObject](modules.md#cookierawobject)
- [DefaultProps](modules.md#defaultprops)
- [EdgeCasesSchools](modules.md#edgecasesschools)
- [SchoolConf](modules.md#schoolconf)
- [SchoolConfOpts](modules.md#schoolconfopts)
- [StringKV](modules.md#stringkv)
- [UserConfOpts](modules.md#userconfopts)
- [UsersConf](modules.md#usersconf)

### Properties

- [log](modules.md#log)

### Variables

- [sstore](modules.md#sstore)

### Functions

- [getSchoolInfos](modules.md#getschoolinfos)
- [handleCookie](modules.md#handlecookie)
- [loadConfFromToml](modules.md#loadconffromtoml)

## Type aliases

### CookieMap

Ƭ **CookieMap**: *Map*<string, Map<string, string\>\>

Defined in: [types/cookie.ts:1](https://github.com/ceajs/cea/blob/8952b25/core/src/types/cookie.ts#L1)

___

### CookieRawObject

Ƭ **CookieRawObject**: *object*

#### Type declaration

Defined in: [types/cookie.ts:3](https://github.com/ceajs/cea/blob/8952b25/core/src/types/cookie.ts#L3)

___

### DefaultProps

Ƭ **DefaultProps**: NoIapDefaultProps & IapDefaultProps

Defined in: [compatibility/edge-case.ts:36](https://github.com/ceajs/cea/blob/8952b25/core/src/compatibility/edge-case.ts#L36)

___

### EdgeCasesSchools

Ƭ **EdgeCasesSchools**: keyof *typeof* schoolEdgeCases

Defined in: [compatibility/edge-case.ts:32](https://github.com/ceajs/cea/blob/8952b25/core/src/compatibility/edge-case.ts#L32)

___

### SchoolConf

Ƭ **SchoolConf**: *object*

#### Type declaration

Defined in: [types/conf.ts:15](https://github.com/ceajs/cea/blob/8952b25/core/src/types/conf.ts#L15)

___

### SchoolConfOpts

Ƭ **SchoolConfOpts**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `auth` | *string* |
| `campuseAuthStartEndpoint` | *string* |
| `campusphere` | *string* |
| `chineseName` | *string* |
| `defaultAddr` | *string* |
| `isIap` | *boolean* |

Defined in: [types/conf.ts:19](https://github.com/ceajs/cea/blob/8952b25/core/src/types/conf.ts#L19)

___

### StringKV

Ƭ **StringKV**: *object*

#### Type declaration

Defined in: [types/helper.ts:1](https://github.com/ceajs/cea/blob/8952b25/core/src/types/helper.ts#L1)

___

### UserConfOpts

Ƭ **UserConfOpts**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addr` | *string*[] |
| `alias` | *string* |
| `cookie?` | [*CookieRawObject*](modules.md#cookierawobject) |
| `password` | *string* |
| `school` | *string* |
| `username` | *string* |

Defined in: [types/conf.ts:6](https://github.com/ceajs/cea/blob/8952b25/core/src/types/conf.ts#L6)

___

### UsersConf

Ƭ **UsersConf**: [*UserConfOpts*](modules.md#userconfopts)[]

Defined in: [types/conf.ts:4](https://github.com/ceajs/cea/blob/8952b25/core/src/types/conf.ts#L4)

## Properties

### log

• **log**: *Signale*<DefaultMethods\>

## Variables

### sstore

• `Const` **sstore**: *any*

Defined in: [index.ts:9](https://github.com/ceajs/cea/blob/8952b25/core/src/index.ts#L9)

## Functions

### getSchoolInfos

▸ **getSchoolInfos**(`users`: [*UsersConf*](modules.md#usersconf)): *Promise*<[*SchoolConf*](modules.md#schoolconf) \| ``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `users` | [*UsersConf*](modules.md#usersconf) |

**Returns:** *Promise*<[*SchoolConf*](modules.md#schoolconf) \| ``null``\>

Defined in: [conf.ts:24](https://github.com/ceajs/cea/blob/8952b25/core/src/conf.ts#L24)

___

### handleCookie

▸ **handleCookie**(`startPointFinder?`: *string*): *Promise*<void\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `startPointFinder?` | *string* |

**Returns:** *Promise*<void\>

Defined in: [index.ts:22](https://github.com/ceajs/cea/blob/8952b25/core/src/index.ts#L22)

___

### loadConfFromToml

▸ **loadConfFromToml**(): [*UsersConf*](modules.md#usersconf) \| ``null``

**Returns:** [*UsersConf*](modules.md#usersconf) \| ``null``

Defined in: [conf.ts:11](https://github.com/ceajs/cea/blob/8952b25/core/src/conf.ts#L11)
