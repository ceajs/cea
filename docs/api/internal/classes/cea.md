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

Defined in: [internal/src/index.ts:5](https://github.com/beetcb/cea/blob/48b4d03/internal/src/index.ts#L5)

## Methods

### addPlugin

▸ **addPlugin**(`plugin`: () => *Promise*<void\>): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `plugin` | () => *Promise*<void\> |

**Returns:** *void*

Defined in: [internal/src/index.ts:7](https://github.com/beetcb/cea/blob/48b4d03/internal/src/index.ts#L7)

___

### start

▸ **start**(): *Promise*<void\>

**Returns:** *Promise*<void\>

Defined in: [internal/src/index.ts:11](https://github.com/beetcb/cea/blob/48b4d03/internal/src/index.ts#L11)
