### 插件: <a align="center" href="https://www.npmjs.com/package/cea"><img alt="cea" src="https://img.shields.io/npm/v/cea?style=social&label=cea"></a>

### 安装

```bash
# Install cea as a cli
npm i -g cea
# Using cea as a module
npm i cea
```

### 示例

1. 使用 CLI

今日校园签到：

```bash
cea sign
```

2. 使用模块

今日校园签到：

```ts
import { Cea, checkIn } from 'cea'
const cea = new Cea()
cea.addPlugin(checkIn)
cea.start()
```
