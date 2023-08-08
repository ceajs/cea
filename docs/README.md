# cea: 高校统一身份验证开发框架(已集成 CPDAILY 签到&查寝插件)

[![npm](https://img.shields.io/npm/v/cea?style=social)](https://www.npmjs.com/package/cea)
[![NPM](https://img.shields.io/npm/l/cea?style=social)](https://github.com/ceajs/cea/blob/master/LICENSE)
[![GitHub Repo stars](https://img.shields.io/github/stars/ceajs/cea?style=social)](https://github.com/ceajs/cea)

## Demo

`cea` 命令行功能演示：

![cea-demo](https://i.imgur.com/fIg7J84.png)

## 亮点

- 关于验证码：使用 [@ceajs/slider-captcha](https://github.com/ceajs/slider-captcha) 支持滑块验证码（实机测试 1000 次通过 940 次），同时也支持普通图片验证码
- 交互式配置: `cea` 提供交互式的命令行完成用户及学校的配置，同时也支持使用 `toml` 文件来配置
- 验证持久化: 缓存验证信息于本地, 只在失效时登录并更新；
- 多用户非阻塞: 利用 Node.js 异步特征，多用户可并行，实现毫秒级的多用户同时操作
- 关于签到插件: ([学校配置](./docs/config.md)时)使用百度地图 API 获取学校全局签到地址, 使用 CPDAILY 接口返回的签到数据获取签到经纬度, 简单来说, 只需知道学校英文简称即可配置好所有签到信息, 充分懒人化
- 复用历史成功签到数据：表单填写方面，Cea 会查找历史签到中最新且成功签到的数据作为模板填写当前表单；查寝图片上传方面，Cea 使用同样的策略获取图片 URL；这省去了配置表单的繁琐过程和图片上传的费时操作
- 支持日志路由转发到微信：方便查看运行结果日志 (详见 [部署指南](./docs/deploy.md))，这也方便 Cea 插件开发者实现推送和统一日志输出 (详见 [插件开发](https://github.com/ceajs/cea#%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91))
- 支持[一键部署签到程序](./docs/deploy.md)：依赖自动安装、触发器自动配置，可能是全网最快最方便的部署

## 准备工作

Cea 使用纯 ESM 模块系统发布，请确保 Node.js(`^12.20.0 || ^14.13.1 || >=16.0.0`) 和 NPM 包管理器在你的操作环境中正确安装

若 Node 版本过低，我们也提供了兼容版，该版本(`cea@cjs`)没有命令行工具，只能[**作为模块使用**](https://github.com/ceajs/cea#%E4%BD%9C%E4%B8%BA%E6%A8%A1%E5%9D%97%E4%BD%BF%E7%94%A8)，这也是我们运行在腾讯云上的版本

### 兼容性说明

> Cea 在配置学校时会显示学校接入方式是 CLOUD 还是 NOTCLOUD

`CLOUD`（表示学校已接入 CPDAILY 统一登陆） 字段的实现是统一的，应该没有兼容性问题

`NOTCLOUD` (表示学校未接入 CPDAILY) 只能爬取网页获得凭据：cea 的登录页爬取策略比较智能（并非 `hard coded`），默认根据第一个登录表单完成全部逻辑，这保证了不错的兼容性

如确实遇到了边缘情况，可以提交 PR (参考 [Contributing Guide](./CONTRIBUTING.md))，只需修改 `./vercel/data/school-edge-cases.json` 文件，添加你的学校。所填字段将作为改学校的特殊值覆盖默认值，默认值就是 NOTCLOUD 对象，详细教程请关注讨论 [#20](https://github.com/ceajs/cea/issues/20)

若你遇到其它问题，请附带日志提交 [Issue](https://github.com/beetcb/cea/issues/new/choose)

## 开始使用

### 作为命令行使用

1. 安装

   ```bash
   npm i -g cea
   ```

2. 配置用户

   交互式配置更简单，会自动配置学校签到位置；但是这种简介可能带来不精确性(比如获取的学校位置不对)，这个时候你应该使用配置文件配置，配置文件还支持配置推送方式和验证码识别方式：

   ```bash
   # 使用交互式命令行配置，暂无推送功能和验证码识别模式配置
   cea user
   # 使用配置文件加载用户
   cea load
   ```

   [配置文件说明](./docs/config.md)

3. 执行签到

   ```bash
   cea sign
   ```

4. 查看 cea 的其它能力

   ```bash
   cea -h
   ```

### 作为模块使用

> 基本流程：引入 cea 和对应插件 -> 创建 cea 实例 -> 注册插件 -> 运行

安装 Cea，如需在低版本 Node 上运行，请安装 `cea@cjs` 版本

```bash
# 新版（推荐）
npm i cea
# 兼容版
npm i cea@cjs
```

下面是 CPDAILY 签到的示例（`cea-check-in` 插件已内置，无需特别安装）

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

## 插件列表

- [`check-in-helper`](./docs/api/plugins/check-in-helper/README.md)
- [`attendance`](./docs/api/plugins/attendance/README.md)
- [`sign`](./docs/api/plugins/sign/README.md)

## 贡献指南

参考 [Contributing Guide](./CONTRIBUTING.md)

## 插件开发

> 插件开发流程：引入 cea-core 的功能 -> 开发功能 -> 导出一个无入参出参的函数

插件核心 `cea-core` [docs/api/core/README.md](./docs/api/core/README.md)

插件示例 `check-in-helper` [docs/api/plugins/check-in-helper/README.md](./docs/api/plugins/check-in-helper/README.md)

我们鼓励插件开发者使用日志统一输出和路由转发到微信的功能，操作方法是：

```js
// 导入 cea-core 包提供的日志工具 log
import { log } from '@ceajs/core'
// 输出统一的命令行日志，此类日志也会被路由(当 `notifier` 字段配置时)，等待最后推送到微信
log.success('hello')
// 异步推送日志，此函数也可接受字符串形参，当作日志一同推送
log.notify()
```

## 鸣谢

感谢 [Cloudbase-Framework](https://github.com/Tencent/cloudbase-framework)、[Github Actions](https://github.com/actions)、[Coding CI](https://help.coding.net/docs/ci/intro.html)、[Gitee Pages](https://gitee.com/help/articles/4136) 提供的优秀服务 🎉

感谢 [wisedu-unified-login-api](https://github.com/ZimoLoveShuang/wisedu-unified-login-api) 提供的最初灵感 ❤️

感谢同类项目的存在，让社区能够相互学习和进步：

- [ZimoLoveShuang/auto-submit](https://github.com/ZimoLoveShuang/auto-submit)
- [AntaresQAQ/campushoy-auto-sign](https://github.com/AntaresQAQ/campushoy-auto-sign)
- [windowsair/fzu-cpDailySign](https://github.com/windowsair/fzu-cpDailySign)
- [CarltonHere/auto-cpdaily](https://github.com/CarltonHere/auto-cpdaily)

## 声明

`cea` - Licensed under [MIT](https://github.com/ceajs/cea/blob/master/LICENSE)

`campusphere-elegant-auth` 仅用于学习和研究 Node.js，请勿商用或违法使用。

> 引用自 MIT 协议：项目作者和维护者不对使用者导致的索赔、损害、侵权或其他任何责任负责。

> 作者: [@beetcb](https://github.com/beetcb), 邮箱: `i@beetcb.com`