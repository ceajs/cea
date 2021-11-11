[cea-check-in](../README.md) / Exports

# cea-core

## Table of contents

### Namespaces

- [sstore](../modules/sstore.md)

### Enumerations

- [CampusphereEndpoint](../enums/CampusphereEndpoint.md)

### Type aliases

- [CookieRawObject](../modules.md#cookierawobject)
- [SchoolConf](../modules.md#schoolconf)
- [SchoolConfOpts](../modules.md#schoolconfopts)
- [StringKV](../modules.md#stringkv)
- [UserConfOpts](../modules.md#userconfopts)
- [UsersConf](../modules.md#usersconf)

### Variables

- [log](../modules.md#log)

### Functions

- [cookieParse](../modules.md#cookieparse)
- [cookieStr](../modules.md#cookiestr)
- [getSchoolInfos](../modules.md#getschoolinfos)
- [handleCookie](../modules.md#handlecookie)
- [loadConfFromToml](../modules.md#loadconffromtoml)

## Type aliases

### CookieRawObject

Ƭ **CookieRawObject**: `Object`

#### Index signature

▪ [K: `string`]: `string`

#### Defined in

[src/types/cookie.ts:3](https://github.com/ceajs/cea/blob/137f0b9/core/src/types/cookie.ts#L3)

___

### SchoolConf

Ƭ **SchoolConf**: `Object`

#### Index signature

▪ [school: `string`]: [`SchoolConfOpts`](../modules.md#schoolconfopts)

#### Defined in

[src/types/conf.ts:14](https://github.com/ceajs/cea/blob/137f0b9/core/src/types/conf.ts#L14)

___

### SchoolConfOpts

Ƭ **SchoolConfOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `auth` | `string` |
| `authURL?` | `string` |
| `campusphere` | `string` |
| `chineseName` | `string` |
| `defaultAddr` | `string` |
| `isCloud` | `boolean` |
| `preAuthURL` | `string` |

#### Defined in

[src/types/conf.ts:18](https://github.com/ceajs/cea/blob/137f0b9/core/src/types/conf.ts#L18)

___

### StringKV

Ƭ **StringKV**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[src/types/helper.ts:1](https://github.com/ceajs/cea/blob/137f0b9/core/src/types/helper.ts#L1)

___

### UserConfOpts

Ƭ **UserConfOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addr` | `string`[] |
| `alias` | `string` |
| `captcha?` | ``"MANUAL"`` \| ``"OCR"`` |
| `password` | `string` |
| `school` | `string` |
| `username` | `string` |

#### Defined in

[src/types/conf.ts:5](https://github.com/ceajs/cea/blob/137f0b9/core/src/types/conf.ts#L5)

___

### UsersConf

Ƭ **UsersConf**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `notifier?` | [\`${number}\`, `string`] |
| `users` | [`UserConfOpts`](../modules.md#userconfopts)[] |

#### Defined in

[src/types/conf.ts:1](https://github.com/ceajs/cea/blob/137f0b9/core/src/types/conf.ts#L1)

## Variables

### log

• **log**: `LogRouter` & { `notify`: () => `Promise`<`void`\> ; `object`: (`obj`: { [K: string]: `string`;  }) => `void`  }

#### Defined in

[src/utils/logger.ts:28](https://github.com/ceajs/cea/blob/137f0b9/core/src/utils/logger.ts#L28)

## Functions

### cookieParse

▸ **cookieParse**(`host`, `headers`): `CookieMap`

Parse http response headers' cookie

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `headers` | `Headers` |

#### Returns

`CookieMap`

#### Defined in

[src/utils/cookie-helper.ts:7](https://github.com/ceajs/cea/blob/137f0b9/core/src/utils/cookie-helper.ts#L7)

___

### cookieStr

▸ **cookieStr**(`host`, `cookieMap`): `string`

Construct a cookie object based on host

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `cookieMap` | `CookieMap` |

#### Returns

`string`

#### Defined in

[src/utils/cookie-helper.ts:50](https://github.com/ceajs/cea/blob/137f0b9/core/src/utils/cookie-helper.ts#L50)

___

### getSchoolInfos

▸ **getSchoolInfos**(`__namedParameters`): `Promise`<[`SchoolConf`](../modules.md#schoolconf) \| ``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`UsersConf`](../modules.md#usersconf) |

#### Returns

`Promise`<[`SchoolConf`](../modules.md#schoolconf) \| ``null``\>

#### Defined in

[src/conf.ts:26](https://github.com/ceajs/cea/blob/137f0b9/core/src/conf.ts#L26)

___

### handleCookie

▸ **handleCookie**(): `Promise`<`void`\>

Iterate through all users: complete unified auth -> store cookie

#### Returns

`Promise`<`void`\>

#### Defined in

[src/index.ts:33](https://github.com/ceajs/cea/blob/137f0b9/core/src/index.ts#L33)

___

### loadConfFromToml

▸ **loadConfFromToml**(): [`UsersConf`](../modules.md#usersconf) \| ``null``

#### Returns

[`UsersConf`](../modules.md#usersconf) \| ``null``

#### Defined in

[src/conf.ts:13](https://github.com/ceajs/cea/blob/137f0b9/core/src/conf.ts#L13)
