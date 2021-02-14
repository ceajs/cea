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

- 新增一键部署签到程序：依赖自动安装、触发器自动配置，可能是全网最快的部署 👇 (点击左边小三角展开部署教程)<details><summary><a href="https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fbeetcb%2Fcea&branch=tcb" target="_blank"><img height="25px" src="https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg"/></a></summary>

  > 本说明帮助你**一键部署**自动签到程序到腾讯云开发
  >
  > **未开通云开发&新注册用户**需要先开通云开发，具体过程为：在 [此地址](https://console.cloud.tencent.com/tcb?from=12335) 注册登录，完成后再进入 [开通地址](https://console.cloud.tencent.com/tcb?from=12335) 开通 ⇢ <span><input type="checkbox" disabled>不创建环境(请勾选)</span>，其它默认 ⇢ 跳转到授权界面并授权，开通成功

  1. 点击 ☝ 部署按钮 ⇢ 登录腾讯云 ⇢ <span><input type="checkbox" disabled>使用免费资源(记得勾选)</span>
     ⇢ `环境名称` 填入 cea ⇢ 下一步 ⇢ 完成

  2. 等待几秒(部署完成后) ⇢ 左栏 `云函数` ⇢ 点击 `cea` 进入此函数配置界面 ⇢ `函数代码` 拦下在线编辑器里修改 `conf.yml` 文件 ⇢ 相应注释都已写好，请自行填入 ⇢ 先**保存**后测试，无报错则成功部署

     ![示例](https://i.imgur.com/ZhTS6Ol.png)

  3. 教程结束 ⚡，此函数会自动在每天 5:00 11:00 16:00 触发，需要自定义签到时间请参考 [cron](https://docs.cloudbase.net/cloud-function/timer-trigger.html#pei-zhi-xiang-jie)，需要自定义在家签到地址请查看：
  <details><summary>如果懒得改就忽略吧！你可以今天在北京、明天在上海签到(它的权重远不及<a href="https://www.zhihu.com/question/375968416">健康码</a>，甚至可以说**校园签到根本没有任何意义)，小场面👏,不值得改</summary><br>
  请修改 `conf.yml` 文件(用户数组里添加 addr 属性)，比如：

  ```yaml
  # 学校英文简称，一个云函数只能配置一个学校
  school: whpu

  # 是否在家签到，可选值为
  # - true            在家签到，使用随机地址(会绕开学校)，可以被用户自定义地址重写
  # - false           学校签到，使用学校地址
  home: true

  # 用户信息配置，支持多用户
  users:
    # 第一个用户信息从这里开始
    # 学工账号用户名
    - username: 11111111
      # 学工账号密码
      password: 1
      # 用户简称，主要方便日志查询
      alias: beetcb
      # 自定义在家签到地址，请提供 经度、纬度、详细地址
      # 推荐使用 https://api.map.baidu.com/lbsapi/getpoint/index.html 查询地址
      addr: [116.622631, 40.204822, '北京市顺义区X012']

    # 第二个用户信息从这里开始，依此类推
  ```

  </details>
     <br></details>

- 新增在家签到功能: 在配置学校过程中，可选 `在家签到`，我们会在全国主流城市随机选点(避开高校)。 若学校信息已经配置，请使用 `cea rm "school"` 清除<details><summary>好奇 `随机` 是哪些地方?</summary>

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

- 交互式配置: `campusphere-elegant-auth` 提供交互式的命令行完成 用户 及 学校 的配置，同时也支持使用 `yml` 文件来配置

- 验证持久化: 缓存验证信息于内存, 只在失效时更新

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

- 学校配置:

  ```sh
  cea -s
  ```

- 用户配置:

  ```sh
  cea -u
  ```

- (可选)使用文件配置用户: 根目录下创建 `userConf.yml`, 参考以下示例:

  ```yml
  # 支持多用户配置,用 yaml 语法数组实现
  # 文件修改完后仍需执行 `cea -u` 加载这些用户，根据提示确保用户已成功加载
  - username: 11111111
    password: 1
    alias: beetcb
  - username: 22222222
    password: 2
    alias: beet
  ```

- 用户配置项说明:
  ```yml
  - username: 账户用户名
    password: 密码
    alias: 用户别名,方便查询
    cookie: 为抓包用户提供便利, 省去登录过程，只需提供 `MOD_AUTH_CAS` 键值, 比如：MOD_AUTH_CAS=aVh237y-K3RPsaST3seDwez1287964, 时效不长，请自行判断
  ```

2. 工具使用:
   本项目提供 **今日校园自动签到** 示例：执行主程序可自动签到：

   ```bash
   cea sign
   ```

3. 扩展:

   若使用 cea 作为二次开发使用，请配置好学校和用户，然后在你的项目中导入 cea，参考：

   ```js
   const { handleCookie, conf } = require('@beetcb/cea')

   // Grab users array
   const users = conf.get('users')
   // Grab school info if you need to use that
   const school = conf.get('school')

   ;(async () => {
     // Log in and save cookie to conf, using conf.get('cookie') to get them
     await handleCookie()
     //After that, you can grab the cookie
     const cookie = conf.get('cookie')
     // Do something cool!
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

感谢 [cloudbase-framework](https://github.com/Tencent/cloudbase-framework) 提供的遍历部署，省去了很多麻烦

## Disclaimer

`campusphere-elegant-auth` 用于学习和研究 NodeJS，请勿商用或违法使用。

> 作者: [`beetcb`](https://www.beetcb.com), 邮箱: `i@beetcb.com`
