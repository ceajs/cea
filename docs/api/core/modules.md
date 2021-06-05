[cea-core](README.md) / Exports

# cea-core

## Table of contents

### Namespaces

- [sstore](modules/sstore.md)

### Enumerations

- [CampusphereEndpoint](enums/campusphereendpoint.md)

### Interfaces

- [FetchCookieOptions](interfaces/fetchcookieoptions.md)
- [handleCookieOptions](interfaces/handlecookieoptions.md)

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

### Functions

- [cookieParse](modules.md#cookieparse)
- [cookieStr](modules.md#cookiestr)
- [getSchoolInfos](modules.md#getschoolinfos)
- [handleCookie](modules.md#handlecookie)
- [loadConfFromToml](modules.md#loadconffromtoml)

## Type aliases

### CookieMap

Ƭ **CookieMap**: *Map*<string, Map<string, string\>\>

Defined in: [src/types/cookie.ts:1](https://github.com/ceajs/cea/blob/97b9b5d/core/src/types/cookie.ts#L1)

___

### CookieRawObject

Ƭ **CookieRawObject**: *object*

#### Type declaration

Defined in: [src/types/cookie.ts:3](https://github.com/ceajs/cea/blob/97b9b5d/core/src/types/cookie.ts#L3)

___

### DefaultProps

Ƭ **DefaultProps**: NoIapDefaultProps & IapDefaultProps

Defined in: [src/compatibility/edge-case.ts:36](https://github.com/ceajs/cea/blob/97b9b5d/core/src/compatibility/edge-case.ts#L36)

___

### EdgeCasesSchools

Ƭ **EdgeCasesSchools**: keyof *typeof* schoolEdgeCases

Defined in: [src/compatibility/edge-case.ts:32](https://github.com/ceajs/cea/blob/97b9b5d/core/src/compatibility/edge-case.ts#L32)

___

### SchoolConf

Ƭ **SchoolConf**: *object*

#### Type declaration

Defined in: [src/types/conf.ts:15](https://github.com/ceajs/cea/blob/97b9b5d/core/src/types/conf.ts#L15)

___

### SchoolConfOpts

Ƭ **SchoolConfOpts**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `auth` | *string* |
| `campusAuthStartEndpoint` | *string* |
| `campusphere` | *string* |
| `chineseName` | *string* |
| `defaultAddr` | *string* |
| `isIap` | *boolean* |

Defined in: [src/types/conf.ts:19](https://github.com/ceajs/cea/blob/97b9b5d/core/src/types/conf.ts#L19)

___

### StringKV

Ƭ **StringKV**: *object*

#### Type declaration

Defined in: [src/types/helper.ts:1](https://github.com/ceajs/cea/blob/97b9b5d/core/src/types/helper.ts#L1)

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

Defined in: [src/types/conf.ts:6](https://github.com/ceajs/cea/blob/97b9b5d/core/src/types/conf.ts#L6)

___

### UsersConf

Ƭ **UsersConf**: [*UserConfOpts*](modules.md#userconfopts)[]

Defined in: [src/types/conf.ts:4](https://github.com/ceajs/cea/blob/97b9b5d/core/src/types/conf.ts#L4)

## Properties

### log

• **log**: *Signale*<DefaultMethods\>

## Functions

### cookieParse

▸ **cookieParse**(`host`: *string*, `headers`: Headers): [*CookieMap*](modules.md#cookiemap)

Parse http response headers' cookie

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | *string* |
| `headers` | Headers |

**Returns:** [*CookieMap*](modules.md#cookiemap)

Defined in: [src/utils/cookie-helper.ts:7](https://github.com/ceajs/cea/blob/97b9b5d/core/src/utils/cookie-helper.ts#L7)

___

### cookieStr

▸ **cookieStr**(`host`: *string*, `cookieMap`: [*CookieMap*](modules.md#cookiemap)): *string*

Construct a cookie object based on host

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | *string* |
| `cookieMap` | [*CookieMap*](modules.md#cookiemap) |

**Returns:** *string*

Defined in: [src/utils/cookie-helper.ts:51](https://github.com/ceajs/cea/blob/97b9b5d/core/src/utils/cookie-helper.ts#L51)

___

### getSchoolInfos

▸ **getSchoolInfos**(`users`: [*UsersConf*](modules.md#usersconf)): *Promise*<[*SchoolConf*](modules.md#schoolconf) \| ``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `users` | [*UsersConf*](modules.md#usersconf) |

**Returns:** *Promise*<[*SchoolConf*](modules.md#schoolconf) \| ``null``\>

Defined in: [src/conf.ts:24](https://github.com/ceajs/cea/blob/97b9b5d/core/src/conf.ts#L24)

___

### handleCookie

▸ **handleCookie**(`options?`: [*handleCookieOptions*](interfaces/handlecookieoptions.md)): *Promise*<void\>

Iterate through all users: complete unified auth -> store cookie

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [*handleCookieOptions*](interfaces/handlecookieoptions.md) |

**Returns:** *Promise*<void\>

Defined in: [src/index.ts:29](https://github.com/ceajs/cea/blob/97b9b5d/core/src/index.ts#L29)

___

### loadConfFromToml

▸ **loadConfFromToml**(): [*UsersConf*](modules.md#usersconf) \| ``null``

**Returns:** [*UsersConf*](modules.md#usersconf) \| ``null``

Defined in: [src/conf.ts:11](https://github.com/ceajs/cea/blob/97b9b5d/core/src/conf.ts#L11)
