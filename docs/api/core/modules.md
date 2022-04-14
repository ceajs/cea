[@ceajs/core](README.md) / Exports

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

[src/types/cookie.ts:3](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/types/cookie.ts#L3)

___

### SchoolConf

Ƭ **SchoolConf**: `Object`

#### Index signature

▪ [school: `string`]: [`SchoolConfOpts`](modules.md#schoolconfopts)

#### Defined in

[src/types/conf.ts:24](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/types/conf.ts#L24)

___

### SchoolConfOpts

Ƭ **SchoolConfOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `authOrigin` | `string` |
| `captchaAuthMode` | `CaptchaAuthMode` |
| `chineseName` | `string` |
| `defaultAddr` | `string` |
| `edgeCase` | `SchoolEdgeCase` |
| `isCloud` | `boolean` |
| `loginURL?` | `string` |
| `preAuthURL` | `string` |

#### Defined in

[src/types/conf.ts:28](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/types/conf.ts#L28)

___

### StringKV

Ƭ **StringKV**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[src/types/helper.ts:1](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/types/helper.ts#L1)

___

### UserConfOpts

Ƭ **UserConfOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addr` | [``""``] \| [`string`, `string`, `string`] |
| `alias` | `string` |
| `captcha?` | ``"MANUAL"`` \| ``"OCR"`` |
| `password` | `string` |
| `retry?` | `number` |
| `school` | `string` |
| `signedDataMonth?` | \`${number}-${number}\` |
| `username` | `string` |

#### Defined in

[src/types/conf.ts:13](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/types/conf.ts#L13)

___

### UsersConf

Ƭ **UsersConf**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `localEdgeCasesFile?` | `string` |
| `notifier?` | [\`${number}\`, `string`, `string`] |
| `users` | [`UserConfOpts`](modules.md#userconfopts)[] |

#### Defined in

[src/types/conf.ts:8](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/types/conf.ts#L8)

## Variables

### log

• **log**: `LogRouter`

#### Defined in

[src/utils/logger.ts:28](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/utils/logger.ts#L28)

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

[src/utils/cookie-helper.ts:7](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/utils/cookie-helper.ts#L7)

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

[src/utils/cookie-helper.ts:50](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/utils/cookie-helper.ts#L50)

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

[src/conf.ts:31](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/conf.ts#L31)

___

### handleCookie

▸ **handleCookie**(): `Promise`<`void`\>

Iterate through all users: complete unified auth -> store cookie

#### Returns

`Promise`<`void`\>

#### Defined in

[src/index.ts:32](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/index.ts#L32)

___

### loadConfFromToml

▸ **loadConfFromToml**(`customFilePath?`): [`UsersConf`](modules.md#usersconf) \| ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `customFilePath?` | `string` |

#### Returns

[`UsersConf`](modules.md#usersconf) \| ``null``

#### Defined in

[src/conf.ts:15](https://github.com/ceajs/cea/blob/a78ea64/src/core/src/conf.ts#L15)
