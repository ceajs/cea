<p align="center">
  <a href="https://github.com/beetcb/campusphere-elegant-auth">
    <img src="./media/demo.gif" alt="test" width="600">
  </a>

<strong><p align="center"><code>c</code>ampusphere-<code>e</code>legant-<code>a</code>uth</p></strong>

  <p align="center">
  使用交互式的配置程序，实现了学工系统的登录
  <br>
  其返回的 <strong>cookie</strong> 可直接用于学工系统或今日校园相关验证
  <br>
  基于此可以开发更多强大工具集 ( 例如本项目提供的 [今日校园自动签到] 示例 )
  <p>
</p>

## Features

- 新增一键部署签到程序：依赖自动安装、触发器自动配置，可能是全网最快、选择最多的部署 👇 (我们支持三种配置方式，请任选其一，点击左边小三角展开部署教程)

  <details><summary>腾讯云开发一键部署</summary>

  > 本说明帮助你**一键部署**自动签到程序到腾讯云开发
  >
  > **未开通云开发&新注册用户**需要先开通云开发，具体过程为：在 [此地址](https://console.cloud.tencent.com/tcb?from=12335) 注册登录，完成后再进入 [开通地址](https://console.cloud.tencent.com/tcb?from=12335) 开通 ⇢ <span><input type="checkbox" disabled>不创建环境(请勾选)</span>，其它默认 ⇢ 跳转到授权界面并授权，开通成功

  [![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fbeetcb%2Fcea&branch=master)

  1. 点击 ☝ 部署按钮 ⇢ 登录腾讯云 ⇢ <span><input type="checkbox" disabled>使用免费资源(记得勾选)</span>
     ⇢ `环境名称` 填入 cea ⇢ 下一步 ⇢ 完成

  2. 等待几秒(部署完成后) ⇢ 左栏 `云函数` ⇢ 点击 `cea` 进入此函数配置界面 ⇢ `函数代码` 拦下在线编辑器里修改 `conf.toml` 文件 ⇢ 相应注释都已写好，请自行填入 ⇢ 先**保存**后测试，无报错则成功部署

  ![示例](https://i.imgur.com/ZhTS6Ol.png)

  3. 教程结束 ⚡ (如有问题，请附带日志提交 issue)，此函数会自动在每天 5:00 11:00 16:00 触发，具体的配置文件示例如下：

  ```toml
  # 学校英文简称，一个云函数只能配置一个学校
  school = "whpu"

  # 使用学校地址签到，第一个用户
  [[users]]
  username = "11"
  password = "11"
  alias = "one"
  addr = ""

  # 使用随机地址在家签到，第二个用户
  [[users]]
  username = "22"
  password = "22"
  alias = "two"
  addr = "home"

  # 使用自定义地址在家签到，第三个用户
  # 推荐使用 https://api.map.baidu.com/lbsapi/getpoint/index.html 查询地址
  [[users]]
  username = "33"
  password = "33"
  alias = "three"
  addr = ["116.622631", "40.204822", "北京市顺义区X012"]
  ```

    </details>
   <details><summary>Coding 持续集成</summary>

  通过 Coding 的持续集成来部署签到程序，教程如下：

  1. [注册 Coding](https://e.coding.net/register)
  2. 单击创建项目按钮 ⇢ 选择代码托管项目 ⇢ 直接单击完成创建(取消邀请成员加入项目) ⇢ 右上角单击新建代码仓库

     ![new repo](https://imgur.com/30kP4ri.png)
     只需填入仓库 URL：https://github.com/beetcb/cea.git，完成创建

     ![repo url](https://imgur.com/UFGbT7w.png)

  3. 左栏持续集成下单击构建计划 ⇢ 右上角单击创建构建计划，页面下滑到底选择`自定义构建过程`

     ![do not use template](https://i.imgur.com/WpcxrKv.png)

     ⇢ 直接下滑到底勾选`使用代码库中的 Jenkinsfile`并单击确定按钮 ⇢ 变量与缓存 ⇢ 批量添加字符串类型环境变量

     ![add mutli envs](https://i.imgur.com/XONsxye.png)

  4. 在弹出的输入框内配置签到信息：

     ```text
     users: 123 321 beet home\n456 654 someone
     school: whpu
     ```

     ![env config](https://i.imgur.com/dr6CAPl.jpg)

     这会配置两个签到用户(同一个学校)，对这两项参数的详细描述为：

     > **users 的值默认都以一个空格分隔，多用户使用\n 换行符分割**

  - `users`: i.e. `123 321 beet`(请在以下三种配置方式中选择一种)
    - `用户名 密码 名称` 用学校地址签到
    - `用户名 密码 名称 home` 在家用随机地址签到
    - `用户名 密码 名称 home 经度 纬度 中文地址` 在家用自定义的经纬度和地址签到，请使用[此工具](https://api.map.baidu.com/lbsapi/getpoint/index.html)生成经纬度
  - `school`: i.e. `whpu`(学校英文简称)

  5. ~~此操作会自动在每天 5:00 11:00 16:00 触发~~ Coding 目前不支持自动配置触发，你需要手动设置触发机制：单击触发机制，下滑添加定时触发，按照 Coding 的逻辑，你需要设置三次触发，分别是 5:00 11:00 16:00，当然你也可以自定义，图例如下

     ![tigger](https://i.imgur.com/xYHsISg.png)

  6. 配置成功后，请手动触发一次来测试配置的正确性

  </details>

    <details><summary>Github Action 部署支持</summary>

  **部分学校域名禁止海外 IP 访问，会签到失败(比如 WHPU)**，部署教程如下：

  1. 右上角 Fork 本项目(可以顺手 star ✨ 支持一下)

  2. 配置签到信息：
     导航到 Fork 仓库的主页面，在仓库名称下，单击 Settings ，在左侧边栏中，单击 Secrets，单击 New repository secret 开始创建签到信息

  ![actions](https://i.imgur.com/Lx6319H.png)
  ![secret](https://i.imgur.com/aM4jUSW.png)

  **你需要添加 2 个 secrets，他们的示例如下：**

  > **users 的值默认都以一个空格分隔，多用户使用\n 换行符分割**

  - `users`: i.e. `123 321 beet`(请在以下三种配置方式中选择一种)
  - `用户名 密码 名称` 用学校地址签到
  - `用户名 密码 名称 home` 在家用随机地址签到
  - `用户名 密码 名称 home 经度 纬度 中文地址` 在家用自定义的经纬度和地址签到，请使用[此工具](https://api.map.baidu.com/lbsapi/getpoint/index.html)生成经纬度
  - `school`: i.e. `whpu`(学校英文简称)

  3. 通过给自己仓库 Star 来测试 Actions 是否执行成功

  ![star](https://i.imgur.com/HHlLA4P.png)

  配置成功后，此操作会自动在每天 5:00 11:00 16:00 触发，尝试签到

    </details>

- 新增在家签到功能: 在配置学校过程中，可选 `在家签到`，我们会在全国主流城市随机选点(避开高校)。 当然我们也支持自定义地址(只不过稍微麻烦点)<details><summary>好奇 `随机` 是哪些地方?</summary>

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

- 验证持久化: 缓存验证信息于内存, 只在失效时更新

- 兼容云服务的 OCR：很多云服务(如云函数)的文件系统并不都是可写入的，我们将 OCR 验证码识别用到的 [tesseract.js](https://github.com/naptha/tesseract.js) 数据和训练缓存包暂存到了 `/tmp`，降低出错率；同时，为加快国内访问速度，下载节点托管于码云

- 多用户非阻塞: 利用 NodeJS 异步特征，多用户可并行，实现毫秒级的多用户同时操作

- 关于签到: (学校配置时)使用百度地图 API 获取学校全局签到地址, 使用今日校园接口返回的签到数据获取签到经纬度, 简单来说, 只需知道学校英文简称即可配置好所有签到信息, 充分懒人化

## Prerequisites

- NPM
- NodeJS

### Compatibility

适用于 whpu (已测试) 和其它 大多数学校(未测试，如有问题，请附带日志提交 [issue](https://github.com/beetcb/cea/issues/new/choose))

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

  # 学校英文简称
  school = "whpu"

  # 使用学校地址签到
  [[users]]
  username = "用户名"
  password = "密码"
  alias = "简称"
  addr = ""

  # 使用随机地址在家签到
  [[users]]
  username = "用户名"
  password = "密码"
  alias = "简称"
  addr = "home"

  # 使用自定义地址在家签到
  [[users]]
  username = "用户名"
  password = "密码"
  alias = "简称"
  addr = ["经度", "纬度", "实际地址"]
  ```

2. 工具使用:
   本项目提供 **今日校园自动签到** 示例：执行主程序可自动签到：

   ```bash
   cea sign
   ```

3. 扩展:

   若使用 cea 作为二次开发使用，请配置好学校和用户，然后在你的项目中导入 cea，参考：

   ```js
   const { conf } = require('@beetcb/cea')

   ;(async () => {
     // Load users from config or environment variables
     await conf.load()
     // Log in and save cookie to conf, using conf.get('cookie') to get them
     await conf.handleCookie()
     // Grab users array
     const users = conf.get('users')
     // Grab school info if you need to use that
     const school = conf.get('school')
     //After that, you can grab the cookie
     const cookie = conf.get('cookie')
     // Do something cool here!
   })()
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

感谢 [cloudbase-framework](https://github.com/Tencent/cloudbase-framework)、[Github Actions](https://github.com/actions)、[Coding CI](https://help.coding.net/docs/ci/intro.html)、[Gitee Pages](https://gitee.com/help/articles/4136) 提供的优秀服务 🎉

## Disclaimer

`campusphere-elegant-auth` 用于学习和研究 NodeJS，请勿商用或违法使用。

> 作者: [`beetcb`](https://www.beetcb.com), 邮箱: `i@beetcb.com`
