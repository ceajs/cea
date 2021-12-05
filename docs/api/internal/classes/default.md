[@ceajs/attendance-plugin](README.md) / [Exports](modules.md) / default

# Class: default

## Table of contents

### Constructors

- [constructor](classes/default.md#constructor)

### Properties

- [plugins](classes/default.md#plugins)

### Methods

- [addPlugin](classes/default.md#addplugin)
- [start](classes/default.md#start)

## Constructors

### constructor

• **new default**()

## Properties

### plugins

• `Private` **plugins**: `Set`<`fn`\>

#### Defined in

[internal/src/index.ts:6](https://github.com/ceajs/cea/blob/4983b2a/internal/src/index.ts#L6)

## Methods

### addPlugin

▸ **addPlugin**(`plugin`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | () => `Promise`<`void`\> |

#### Returns

`void`

#### Defined in

[internal/src/index.ts:8](https://github.com/ceajs/cea/blob/4983b2a/internal/src/index.ts#L8)

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[internal/src/index.ts:12](https://github.com/ceajs/cea/blob/4983b2a/internal/src/index.ts#L12)
