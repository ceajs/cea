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
// 导入 Cea 和内置的签到插件中的函数 checkIn
import Cea, { checkIn } from 'cea'
// 创建 Cea 的实例
const cea = new Cea()
// 注册插件
cea.addPlugin(checkIn)
// 执行签到脚本
cea.start()
```
