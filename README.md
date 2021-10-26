<strong><p align="center">
<img alt="cea-logo" width="100" src="./assets/logo.png">
<br>
<code>c</code>ampusphere-<code>e</code>legant-<code>a</code>uth

</p></strong>

<p align="center">
 <a align="center" href="https://www.npmjs.com/package/cea">
    <img alt="npm" src="https://img.shields.io/npm/v/cea?style=social">
    <img alt="NPM" src="https://img.shields.io/npm/l/cea?style=social">
  </a>
</p>
  <p align="center">
  <strong>高校统一身份验证开发框架</strong>(已集成今日校园签到插件)
  <br>
  欢迎点击右上角   <a href="https://github.com/ceajs/cea">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/ceajs/cea?style=social">
  </a> 支持此项目
</p>

## Demo

`cea` 命令行功能演示：

<img alt="cea-demo" src="https://i.imgur.com/fIg7J84.png">

## 亮点

- 交互式配置: `cea` 提供交互式的命令行完成用户及学校的配置，同时也支持使用 `toml` 文件来配置

- 验证持久化: 缓存验证信息于内存, 只在失效时登录并更新；云端和本地缓存能力来源于我的另一个项目 [sstore](https://github.com/beetcb/sstore)

- 多用户非阻塞: 利用 Node.js 异步特征，多用户可并行，实现毫秒级的多用户同时操作

- 关于签到插件: (学校配置时)使用百度地图 API 获取学校全局签到地址, 使用今日校园接口返回的签到数据获取签到经纬度, 简单来说, 只需知道学校英文简称即可配置好所有签到信息, 充分懒人化

- 支持一键部署签到程序：依赖自动安装、触发器自动配置，可能是全网最快最方便的部署 (详见 [部署指南](./docs/deploy.md))

## 准备工作

请确保 Node.js(`^12.20.0 || ^14.13.1 || >=16.0.0`) 和 NPM 包管理器在你的操作环境中正确安装

### 兼容性说明

统一身份认证地址包含 `iap`（表示已接入今日校园） 字段的实现是统一的，应该没有兼容性问题

若未接入今日校园，只能爬取网页获得凭据：cea 的登录页爬取策略比较智能（并非 `hard coded`），默认根据第一个登录表单完成全部逻辑，这保证了不错的兼容性

如确实遇到了边缘情况，有能力的话可以提交 PR (参考 [Contribution Guide](./CONTRIBUTING.md))，只需修改 `./core/src/compatibility/edge-case.ts` 文件，添加你的学校：

```diff
const schoolEdgeCases = {
+  学校中文全称: {
+    formIdx: 2, // 默认账号密码登录表单的索引，你需要手动查看 HTML 结构来确定
+    checkCaptchaPath: '/getCaptcha.htl', // 检测是否需要验证码的路径
+    getCaptchaPath: '/checkNeedCaptcha.htl', // 获取验证码的路径
+    pwdEncrypt: true, // 密码是否加密，默认 true
+    rememberMe: true, // [这一项不会影响登录结果]勾选*天免登录后的值，有些学校可能是不同的字符，默认为 true，你需要手动查看登录请求来确定
+  },
}
```

若你不熟悉 Node.js，遇到登录问题，请附带日志提交 [Issue](https://github.com/beetcb/cea/issues/new/choose)

## 开始使用

### 作为命令行使用

1. 安装

   ```bash
   npm i -g cea
   ```

2. 配置用户

   ```bash
   # 使用交互式命令行配置
   cea user
   # 使用配置文件 ./conf.toml 加载用户
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

下面是今日校园签到的示例（`cea-check-in` 插件已内置，无需特别安装）

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

- [`cea-check-in`](./docs/api/plugins/check-in/README.md)

## 贡献指南

参考 [Contribution Guide](./CONTRIBUTING.md)

## 插件开发

> 插件开发流程：引入 cea-core 的功能 -> 开发功能 -> 导出一个无入参出参的函数

插件核心 `cea-core` [docs/api/core/README.md](./docs/api/core/README.md)

插件示例 `cea-check-in` [docs/api/plugins/check-in/README.md](./docs/api/plugins/check-in/README.md)

## 鸣谢

感谢 [Cloudbase-Framework](https://github.com/Tencent/cloudbase-framework)、[Github Actions](https://github.com/actions)、[Coding CI](https://help.coding.net/docs/ci/intro.html)、[Gitee Pages](https://gitee.com/help/articles/4136) 提供的优秀服务 🎉

## 声明

`cea` - Licensed under [MIT](https://github.com/ceajs/cea/blob/master/LICENSE)

`campusphere-elegant-auth` 仅用于学习和研究 Node.js，请勿商用或违法使用。

> 作者: [<img src="https://img.shields.io/github/followers/beetcb?label=%40beetcb&style=social">](https://github.com/beetcb), 邮箱: `i@beetcb.com`
