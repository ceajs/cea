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

### Variables

- [log](modules.md#log)
- [sstore](modules.md#sstore)

### Functions

- [getSchoolInfos](modules.md#getschoolinfos)
- [handleCookie](modules.md#handlecookie)
- [loadConfFromToml](modules.md#loadconffromtoml)

## Type aliases

### CookieMap

Ƭ **CookieMap**: *Map*<string, [*string*, *string*][]\>

Defined in: lib/src/types/cookie.d.ts:1

___

### CookieRawObject

Ƭ **CookieRawObject**: { [key in \`campusphere::/${string}\` \| \`swms::/${string}\`]: string}

Defined in: lib/src/types/cookie.d.ts:2

___

### DefaultProps

Ƭ **DefaultProps**: NoIapDefaultProps & IapDefaultProps

Defined in: lib/src/compatibility/edge-case.d.ts:27

___

### EdgeCasesSchools

Ƭ **EdgeCasesSchools**: keyof *typeof* schoolEdgeCases

Defined in: lib/src/compatibility/edge-case.d.ts:24

___

### SchoolConf

Ƭ **SchoolConf**: *object*

#### Type declaration

Defined in: lib/src/types/conf.d.ts:12

___

### SchoolConfOpts

Ƭ **SchoolConfOpts**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `campusphere` | *string* |
| `chineseName` | *string* |
| `defaultAddr` | *string* |
| `isIap` | *boolean* |
| `loginStartEndpoint` | *string* |
| `swms` | *string* |

Defined in: lib/src/types/conf.d.ts:15

___

### StringKV

Ƭ **StringKV**: *object*

#### Type declaration

Defined in: lib/src/types/helper.d.ts:1

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

Defined in: lib/src/types/conf.d.ts:4

___

### UsersConf

Ƭ **UsersConf**: [*UserConfOpts*](modules.md#userconfopts)[]

Defined in: lib/src/types/conf.d.ts:3

## Variables

### log

• `Const` **log**: Signale

Defined in: lib/src/utils/logger.d.ts:2

___

### sstore

• `Const` **sstore**: *any*

Defined in: [src/index.ts:6](https://github.com/ceajs/cea/blob/b22da07/core/src/index.ts#L6)

## Functions

### getSchoolInfos

▸ **getSchoolInfos**(`users`: [*UsersConf*](modules.md#usersconf)): *Promise*<[*SchoolConf*](modules.md#schoolconf) \| ``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `users` | [*UsersConf*](modules.md#usersconf) |

**Returns:** *Promise*<[*SchoolConf*](modules.md#schoolconf) \| ``null``\>

Defined in: [src/conf.ts:24](https://github.com/ceajs/cea/blob/b22da07/core/src/conf.ts#L24)

___

### handleCookie

▸ **handleCookie**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [src/index.ts:19](https://github.com/ceajs/cea/blob/b22da07/core/src/index.ts#L19)

___

### loadConfFromToml

▸ **loadConfFromToml**(): [*UsersConf*](modules.md#usersconf) \| ``null``

**Returns:** [*UsersConf*](modules.md#usersconf) \| ``null``

Defined in: [src/conf.ts:11](https://github.com/ceajs/cea/blob/b22da07/core/src/conf.ts#L11)
