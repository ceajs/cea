cea / [Exports](modules.md)

<strong><p align="center"><code>c</code>ampusphere-<code>e</code>legant-<code>a</code>uth</p></strong>

<p align="center">
 <a align="center" href="https://www.npmjs.com/package/cea">
    <img alt="npm" src="https://img.shields.io/npm/v/cea?style=social">
    <img alt="NPM" src="https://img.shields.io/npm/l/cea?style=social">
  </a>
</p>
  <p align="center">
  <strong>高校统一身份验证及开发框架</strong>(已集成今日校园签到插件)
  <br>
  欢迎右上角   <a href="https://github.com/beetcb/cea">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/beetcb/cea?style=social">
  </a> 支持此项目
  <p>
</p>

## 亮点

- 新增一键部署签到程序：依赖自动安装、触发器自动配置，可能是全网最快、选择最多的部署 👇 (详见 [部署指南](./docs/deploy.md))

- 交互式配置: `cea` 提供交互式的命令行完成用户及学校的配置，同时也支持使用 `toml` 文件来配置

- 验证持久化: 缓存验证信息于内存, 只在失效时登录并更新；云端和本地缓存能力来源于我的另一个项目 [sstore](https://github.com/beetcb/sstore)

- 多用户非阻塞: 利用 Node.js 异步特征，多用户可并行，实现毫秒级的多用户同时操作

- 关于签到插件: (学校配置时)使用百度地图 API 获取学校全局签到地址, 使用今日校园接口返回的签到数据获取签到经纬度, 简单来说, 只需知道学校英文简称即可配置好所有签到信息, 充分懒人化

## 准备工作

请确保 Node.js 和 NPM 包管理器在你的操作环境中正确安装

### Compatibility

统一身份认证地址包含 `iap`（表示已接入今日校园） 字段的实现是统一的，应该没有兼容性问题

若未接入今日校园，只能爬取网页获得凭据：cea 的登录页爬取策略比较智能（并非 `hard coded`），默认根据第一个登录表单完成全部逻辑，这保证了不错的兼容性

如确实遇到了边缘情况，有能力的话可以提交 PR ，只需修改 `./core/src/compatibility/edge-case.ts` 文件，添加你的学校：

```diff
const schoolEdgeCases = {
+  学校中文全称: {
+    formIdx: 2, // 默认账号密码登录表单的索引，你需要手动查看 HTML 结构来确定
+    checkCaptchaPath: '/getCaptcha.html', // 检测是否需要验证码的路径
+    getCaptchaPath: '/checkNeedCaptcha.html', // 获取验证码的路径
+    pwdEncrypt: true, // 密码是否加密，默认 true
+    rememberMe: true, // [这一项不会影响登录结果]勾选*天免登录后的值，有些学校可能是不同的字符，默认为 true，你需要手动查看登录请求来确定
+  },
}
```

若你不熟悉 Node.js，遇到登录问题，请附带日志提交 [Issue](https://github.com/beetcb/cea/issues/new/choose)

## Get started

1. 安装此项目

```sh
# 使用命令行操作
npm i -g cea
# 使用脚本操作
npm i cea
```

2. 初始化学校及用户

- 用户配置:

  交互式配置用户：

  ```sh
  cea user
  ```

- 学校配置:

  ```sh
  cea school
  ```

- (可选)使用文件配置用户: 根目录下创建 `conf.toml`, 参考以下示例:

  ```toml
  # 文件修改完后仍需执行 `cea load` 加载这些用户，根据提示确保用户已成功加载

  # 学校的英文简称（推荐，部分学校支持，请查阅[支持英文简称的学校列表](https://github.com/beetcb/cea/blob/master/docs/abbrList.sh)自行判断）或中文全称（备用选项，所有学校都支持）
  school = "whpu"

  # 使用学校地址签到
  [[users]]
  username = "用户名"
  password = "密码"
  alias = "简称一"
  addr = ""

  # 使用随机地址在家签到
  [[users]]
  username = "用户名"
  password = "密码"
  alias = "简称二"
  addr = "home"

  # 使用自定义地址在家签到
  [[users]]
  username = "用户名"
  password = "密码"
  alias = "简称三"
  addr = ["经度", "纬度", "实际地址"]
  ```

2. 工具使用:
   本项目提供 **今日校园自动签到** 示例：执行主程序可自动签到：

   ```bash
   cea sign
   ```

3. 扩展:

   若使用 cea 作为二次开发使用，请配置好学校和用户，然后在你的项目中导入 cea，参考自动签到示例：

   ```js
   const cea = require('@beetcb/cea')

   ;(async () => {
     // Log in and save cookie to cea, using cea.get('cookie') to get them (this function resolve an users array with cookie and sign in methods)
     const usersWithTask = await cea.handleCookie()
     // Sign in
     const logs = await signIn(usersWithTask)
     // Print prettier logs info
     console.table(logs)
   })()

   async function signIn(usersWithTask) {
     const logs = {}
     // sign in asynchronizedly with promise all and diff instance of signApp class
     await Promise.all(
       usersWithTask.map(async (i) => {
         await i.sign.signWithForm()
         logs[i.alias || i.id] = i.sign.result
       })
     )
     // store cookie using sstore module
     cea.close()
     return logs
   }
   ```

   使用 `handleCookie` 能够完成登录和 cookie 有效性验证，无需传入任何形参; 再通过 `conf` 可获得 cookie 信息对象，含 `swms` 和 `campusphere` 参数，分别对应 学工 和 金智教务(今日校园相关) 验证凭据

4. 清空配置:

```sh
# 清空学校配置
cea rm 'school'
# 清空用户配置
cea rm 'users'
# 清空所有配置
cea rm 'all'
```

## Thanks

登录中加解密过程大量参考 [wisedu-unified-login-api](https://github.com/ZimoLoveShuang/wisedu-unified-login-api) 项目，十分感谢

感谢 [Cloudbase-Framework](https://github.com/Tencent/cloudbase-framework)、[Github Actions](https://github.com/actions)、[Coding CI](https://help.coding.net/docs/ci/intro.html)、[Gitee Pages](https://gitee.com/help/articles/4136) 提供的优秀服务 🎉

## Disclaimer

`@beetcb/cea` - Licensed under [MIT](https://github.com/beetcb/cea/blob/master/LICENSE)

`campusphere-elegant-auth` 仅用于学习和研究 Node.js，请勿商用或违法使用。

> 作者: [<img src="https://img.shields.io/github/followers/beetcb?label=%40beetcb&style=social">](https://github.com/beetcb), 邮箱: `i@beetcb.com`
