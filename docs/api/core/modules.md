[@ceajs/attendance-plugin](README.md) / Exports

# @ceajs/core

## Table of contents

### Namespaces

- [sstore](modules/sstore.md)

### Type aliases

- [CookieRawObject](modules.md#cookierawobject)
- [SchoolConf](modules.md#schoolconf)
- [SchoolConfOpts](modules.md#schoolconfopts)
- [StringKV](modules.md#stringkv)
- [UserConfOpts](modules.md#userconfopts)
- [UsersConf](modules.md#usersconf)

### Variables

- [log](modules.md#log)

### Functions

- [cookieParse](modules.md#cookieparse)
- [cookieStr](modules.md#cookiestr)
- [getSchoolInfos](modules.md#getschoolinfos)
- [handleCookie](modules.md#handlecookie)
- [loadConfFromToml](modules.md#loadconffromtoml)

## Type aliases

### CookieRawObject

Ƭ **CookieRawObject**: `Object`

#### Index signature

▪ [K: `string`]: `string`

#### Defined in

[src/types/cookie.ts:3](https://github.com/ceajs/cea/blob/a82f96f/core/src/types/cookie.ts#L3)

___

### SchoolConf

Ƭ **SchoolConf**: `Object`

#### Index signature

▪ [school: `string`]: [`SchoolConfOpts`](modules.md#schoolconfopts)

#### Defined in

[src/types/conf.ts:17](https://github.com/ceajs/cea/blob/a82f96f/core/src/types/conf.ts#L17)

___

### SchoolConfOpts

Ƭ **SchoolConfOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `authOrigin` | `string` |
| `chineseName` | `string` |
| `defaultAddr` | `string` |
| `edgeCase` | `SchoolEdgeCase` |
| `isCloud` | `boolean` |
| `loginURL?` | `string` |
| `preAuthURL` | `string` |

#### Defined in

[src/types/conf.ts:21](https://github.com/ceajs/cea/blob/a82f96f/core/src/types/conf.ts#L21)

___

### StringKV

Ƭ **StringKV**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[src/types/helper.ts:1](https://github.com/ceajs/cea/blob/a82f96f/core/src/types/helper.ts#L1)

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
| `signedDataMonth?` | \`${number}-${number}\` |
| `username` | `string` |

#### Defined in

[src/types/conf.ts:7](https://github.com/ceajs/cea/blob/a82f96f/core/src/types/conf.ts#L7)

___

### UsersConf

Ƭ **UsersConf**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `notifier?` | [\`${number}\`, `string`, `string`] |
| `users` | [`UserConfOpts`](modules.md#userconfopts)[] |

#### Defined in

[src/types/conf.ts:3](https://github.com/ceajs/cea/blob/a82f96f/core/src/types/conf.ts#L3)

## Variables

### log

• **log**: `LogRouter` & { `notify`: () => `Promise`<`void`\> ; `object`: (`obj`: { [K: string]: `string`;  }) => `void`  }

#### Defined in

[src/utils/logger.ts:28](https://github.com/ceajs/cea/blob/a82f96f/core/src/utils/logger.ts#L28)

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

[src/utils/cookie-helper.ts:7](https://github.com/ceajs/cea/blob/a82f96f/core/src/utils/cookie-helper.ts#L7)

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

[src/utils/cookie-helper.ts:50](https://github.com/ceajs/cea/blob/a82f96f/core/src/utils/cookie-helper.ts#L50)

___

### getSchoolInfos

▸ **getSchoolInfos**(`__namedParameters`): `Promise`<[`SchoolConf`](modules.md#schoolconf) \| ``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`UsersConf`](modules.md#usersconf) |

#### Returns

`Promise`<[`SchoolConf`](modules.md#schoolconf) \| ``null``\>

#### Defined in

[src/conf.ts:27](https://github.com/ceajs/cea/blob/a82f96f/core/src/conf.ts#L27)

___

### handleCookie

▸ **handleCookie**(): `Promise`<`void`\>

Iterate through all users: complete unified auth -> store cookie

#### Returns

`Promise`<`void`\>

#### Defined in

[src/index.ts:32](https://github.com/ceajs/cea/blob/a82f96f/core/src/index.ts#L32)

___

### loadConfFromToml

▸ **loadConfFromToml**(): [`UsersConf`](modules.md#usersconf) \| ``null``

#### Returns

[`UsersConf`](modules.md#usersconf) \| ``null``

#### Defined in

[src/conf.ts:14](https://github.com/ceajs/cea/blob/a82f96f/core/src/conf.ts#L14)
