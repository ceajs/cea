<p align="center">
  <a href="https://github.com/beetcb/cea">
    <img src="https://s4.gifyu.com/images/cea.gif" alt="test" width="600">
  </a>

<strong><p align="center"><code>c</code>ampusphere-<code>e</code>legant-<code>a</code>uth</p></strong>

<p align="center">
 <a align="center" href="https://www.npmjs.com/package/@beetcb/cea">
    <img alt="npm" src="https://img.shields.io/npm/v/@beetcb/cea?style=social">
    <img alt="NPM" src="https://img.shields.io/npm/l/@beetcb/cea?style=social">
  </a>
</p>
  <p align="center">
  交互式的配置程序 + 学工系统多用户并发登录 + 云端部署及缓存
  <br>
  其返回的 <strong>cookie</strong> 可直接用于学工系统或今日校园相关验证
  <br>
  基于此可以开发更多强大工具集 ( 例如本项目提供的 [今日校园自动签到] 示例 )，欢迎右上角   <a href="https://github.com/beetcb/cea">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/beetcb/cea?style=social">
  </a> 支持此项目
  <p>
</p>

## Features

- 新增一键部署签到程序：依赖自动安装、触发器自动配置，可能是全网最快、选择最多的部署 👇 (详见 [部署指南](./docs/deploy.md))

- 新增在家签到功能: 在配置学校过程中，可选 `在家签到`，我们会在全国主流城市随机选点(避开高校)，也可以自定义地址<details><summary>好奇 `随机` 是哪些地方?</summary>

  ```js
  // Hard coded position info
  // Randomly generated from http://api.map.baidu.com/lbsapi
  const posGenFromCitys = [
    ['116.622631', '40.204822', '北京市顺义区X012'],
    ['115.825701', '32.914915', '安徽省阜阳市颍泉区胜利北路79'],
    ['119.292590', '26.164789', '福建省福州市晋安区'],
    ['103.836093', '36.068012', '甘肃省兰州市城关区南滨河东路709'],
    ['108.360128', '22.883516', '广西壮族自治区南宁市兴宁区'],
    ['113.391549', '22.590350', '广东省中山市兴港中路172号'],
    ['111.292396', '30.718343', '湖北省宜昌市西陵区珍珠路32号'],
    ['118.793117', '32.074771', '江苏省南京市玄武区昆仑路8号'],
  ]
  ```

  </details>

- 交互式配置: `campusphere-elegant-auth` 提供交互式的命令行完成 用户 及 学校 的配置，同时也支持使用 `toml` 文件来配置

- 验证持久化: 缓存验证信息于内存, 只在失效时登录并更新；云端和本地缓存能力来源于我的另一个项目 [sstore](https://github.com/beetcb/sstore)

- 兼容云服务的 OCR：很多云服务(如云函数)的文件系统并不都是可写入的，我们将 OCR 验证码识别用到的 [tesseract.js](https://github.com/naptha/tesseract.js) 数据包和训练缓存包暂存到了 `/tmp`，降低出错率；同时，为加快国内访问速度，下载节点托管于码云

- 多用户非阻塞: 利用 Node.js 异步特征，多用户可并行，实现毫秒级的多用户同时操作

- 关于签到: (学校配置时)使用百度地图 API 获取学校全局签到地址, 使用今日校园接口返回的签到数据获取签到经纬度, 简单来说, 只需知道学校英文简称即可配置好所有签到信息, 充分懒人化

## Prerequisites

- NPM
- Node.js

### Compatibility

登录地址包含 `iap`（表示已接入今日校园） 字段的实现是统一的，应该没有兼容性问题

若未接入今日校园，只能爬取网页获得凭据：cea 的登录页爬取策略比较智能（并非 `hard coded`），默认根据第一个登录表单完成全部逻辑，这保证了不错的兼容性

如确实遇到了边缘情况，有能力的话可以提交 PR ，只需修改 `./crawler/school-edge-cases.js` 文件，添加你的学校：

```diff
// @ts-check
const schoolEdgeCases = {
+  学校中文全称: {
+    formIdx: 2, // 默认账号密码登录表单的索引，你需要手动查看 HTML 结构来确定
+    checkCaptchaPath: '/getCaptcha.html', // 检测是否需要验证码的路径
+    getCaptchaPath: '/checkNeedCaptcha.html', // 获取验证码的路径
+    pwdEncrypt: false, // 密码是否加密，默认 true
+    rememberMe: 'on', // [这一项不会影响登录结果]勾选*天免登录后的值，有些学校可能是不同的字符，默认为 true，你需要手动查看登录请求来确定
+  },
}
```

若你不熟悉 Node.js，遇到登录问题，请附带日志提交 [Issue](https://github.com/beetcb/cea/issues/new/choose)

支持使用英文简称的学校列表：[abbrList](./docs/abbrList.sh)

## Get started

1. 安装此项目

```sh
npm i -g @beetcb/cea
```

2. 初始化学校及用户

- 用户配置:

  交互式配置用户：

  ```sh
  cea -u
  ```

  或者从 `conf.toml` 文件配置用户，同时也会配置学校

  ```sh
  cea load
  ```

- 学校配置:

  ```sh
  cea -s
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
