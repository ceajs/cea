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

[internal/src/index.ts:5](https://github.com/ceajs/cea/blob/a82f96f/internal/src/index.ts#L5)

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

[internal/src/index.ts:7](https://github.com/ceajs/cea/blob/a82f96f/internal/src/index.ts#L7)

___

### start

▸ **start**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[internal/src/index.ts:11](https://github.com/ceajs/cea/blob/a82f96f/internal/src/index.ts#L11)
