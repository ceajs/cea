[cea](../README.md) / [Exports](../modules.md) / Cea

# Class: Cea

## Table of contents

### Constructors

- [constructor](cea.md#constructor)

### Properties

- [plugins](cea.md#plugins)

### Methods

- [addPlugin](cea.md#addplugin)
- [start](cea.md#start)

## Constructors

### constructor

\+ **new Cea**(): [*Cea*](cea.md)

**Returns:** [*Cea*](cea.md)

## Properties

### plugins

• `Private` **plugins**: *Set*<() => *Promise*<void\>\>

Defined in: [internal/src/index.ts:6](https://github.com/ceajs/cea/blob/9a35a33/internal/src/index.ts#L6)

## Methods

### addPlugin

▸ **addPlugin**(`plugin`: () => *Promise*<void\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | () => *Promise*<void\> |

**Returns:** *void*

Defined in: [internal/src/index.ts:8](https://github.com/ceajs/cea/blob/9a35a33/internal/src/index.ts#L8)

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [internal/src/index.ts:12](https://github.com/ceajs/cea/blob/9a35a33/internal/src/index.ts#L12)
