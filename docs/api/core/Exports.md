[cea-core](../wiki/README) / Exports

# cea-core

## Table of contents

### Namespaces

- [sstore](../wiki/Namespace:%20sstore)

### Enumerations

- [CampusphereEndpoint](../wiki/Enumeration:%20CampusphereEndpoint)

### Interfaces

- [FetchCookieOptions](../wiki/Interface:%20FetchCookieOptions)
- [HandleCookieOptions](../wiki/Interface:%20HandleCookieOptions)

### Type aliases

- [CookieMap](../wiki/Exports#cookiemap)
- [CookieRawObject](../wiki/Exports#cookierawobject)
- [DefaultProps](../wiki/Exports#defaultprops)
- [EdgeCasesSchools](../wiki/Exports#edgecasesschools)
- [SchoolConf](../wiki/Exports#schoolconf)
- [SchoolConfOpts](../wiki/Exports#schoolconfopts)
- [StringKV](../wiki/Exports#stringkv)
- [UserConfOpts](../wiki/Exports#userconfopts)
- [UsersConf](../wiki/Exports#usersconf)

### Properties

- [log](../wiki/Exports#log)

### Functions

- [cookieParse](../wiki/Exports#cookieparse)
- [cookieStr](../wiki/Exports#cookiestr)
- [getSchoolInfos](../wiki/Exports#getschoolinfos)
- [handleCookie](../wiki/Exports#handlecookie)
- [loadConfFromToml](../wiki/Exports#loadconffromtoml)

## Type aliases

### CookieMap

Ƭ **CookieMap**: `Map`<`string`, `Map`<`string`, `string`\>\>

#### Defined in

[src/types/cookie.ts:1](https://github.com/ceajs/cea/blob/8cb23a1/core/src/types/cookie.ts#L1)

___

### CookieRawObject

Ƭ **CookieRawObject**: `Object`

#### Index signature

▪ [K: `string`]: `string`

#### Defined in

[src/types/cookie.ts:3](https://github.com/ceajs/cea/blob/8cb23a1/core/src/types/cookie.ts#L3)

___

### DefaultProps

Ƭ **DefaultProps**: `NoIapDefaultProps` & `IapDefaultProps`

#### Defined in

[src/compatibility/edge-case.ts:42](https://github.com/ceajs/cea/blob/8cb23a1/core/src/compatibility/edge-case.ts#L42)

___

### EdgeCasesSchools

Ƭ **EdgeCasesSchools**: keyof typeof `schoolEdgeCases`

#### Defined in

[src/compatibility/edge-case.ts:38](https://github.com/ceajs/cea/blob/8cb23a1/core/src/compatibility/edge-case.ts#L38)

___

### SchoolConf

Ƭ **SchoolConf**: `Object`

#### Index signature

▪ [school: `string`]: [`SchoolConfOpts`](../wiki/Exports#schoolconfopts)

#### Defined in

[src/types/conf.ts:15](https://github.com/ceajs/cea/blob/8cb23a1/core/src/types/conf.ts#L15)

___

### SchoolConfOpts

Ƭ **SchoolConfOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `auth` | `string` |
| `campusphere` | `string` |
| `chineseName` | `string` |
| `defaultAddr` | `string` |
| `isIap` | `boolean` |
| `preAuthURL` | `string` |

#### Defined in

[src/types/conf.ts:19](https://github.com/ceajs/cea/blob/8cb23a1/core/src/types/conf.ts#L19)

___

### StringKV

Ƭ **StringKV**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[src/types/helper.ts:1](https://github.com/ceajs/cea/blob/8cb23a1/core/src/types/helper.ts#L1)

___

### UserConfOpts

Ƭ **UserConfOpts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addr` | `string`[] |
| `alias` | `string` |
| `cookie?` | [`CookieRawObject`](../wiki/Exports#cookierawobject) |
| `password` | `string` |
| `school` | `string` |
| `username` | `string` |

#### Defined in

[src/types/conf.ts:6](https://github.com/ceajs/cea/blob/8cb23a1/core/src/types/conf.ts#L6)

___

### UsersConf

Ƭ **UsersConf**: [`UserConfOpts`](../wiki/Exports#userconfopts)[]

#### Defined in

[src/types/conf.ts:4](https://github.com/ceajs/cea/blob/8cb23a1/core/src/types/conf.ts#L4)

## Properties

### log

• **log**: `Signale`<`DefaultMethods`\>

## Functions

### cookieParse

▸ **cookieParse**(`host`, `headers`): [`CookieMap`](../wiki/Exports#cookiemap)

Parse http response headers' cookie

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `headers` | `Headers` |

#### Returns

[`CookieMap`](../wiki/Exports#cookiemap)

#### Defined in

[src/utils/cookie-helper.ts:7](https://github.com/ceajs/cea/blob/8cb23a1/core/src/utils/cookie-helper.ts#L7)

___

### cookieStr

▸ **cookieStr**(`host`, `cookieMap`): `string`

Construct a cookie object based on host

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `cookieMap` | [`CookieMap`](../wiki/Exports#cookiemap) |

#### Returns

`string`

#### Defined in

[src/utils/cookie-helper.ts:50](https://github.com/ceajs/cea/blob/8cb23a1/core/src/utils/cookie-helper.ts#L50)

___

### getSchoolInfos

▸ **getSchoolInfos**(`users`): `Promise`<[`SchoolConf`](../wiki/Exports#schoolconf) \| ``null``\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `users` | [`UsersConf`](../wiki/Exports#usersconf) |

#### Returns

`Promise`<[`SchoolConf`](../wiki/Exports#schoolconf) \| ``null``\>

#### Defined in

[src/conf.ts:25](https://github.com/ceajs/cea/blob/8cb23a1/core/src/conf.ts#L25)

___

### handleCookie

▸ **handleCookie**(`options?`): `Promise`<`void`\>

Iterate through all users: complete unified auth -> store cookie

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`HandleCookieOptions`](../wiki/Interface:%20HandleCookieOptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/index.ts:28](https://github.com/ceajs/cea/blob/8cb23a1/core/src/index.ts#L28)

___

### loadConfFromToml

▸ **loadConfFromToml**(): [`UsersConf`](../wiki/Exports#usersconf) \| ``null``

#### Returns

[`UsersConf`](../wiki/Exports#usersconf) \| ``null``

#### Defined in

[src/conf.ts:12](https://github.com/ceajs/cea/blob/8cb23a1/core/src/conf.ts#L12)
