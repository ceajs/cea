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

- 交互式配置: `campusphere-elegant-auth` 提供交互式的命令行完成 用户 及 学校 的配置，同时也支持使用 `yml` 文件来配置

- 验证持久化: 缓存验证信息于内存, 只在失效时更新

- 多用户非阻塞: 利用 NodeJS 异步特征，多用户可并行，实现毫秒级的多用户同时操作

- 关于签到: (学校配置时)使用百度地图 API 获取学校全局签到地址, 使用今日校园接口返回的签到数据获取签到经纬度, 简单来说, 只需知道学校英文简称即可配置好所有签到信息, 充分懒人化

- 新增在家签到功能: 在配置学校过程中，可选 `在家签到`，我们会在全国主流城市随机选点(避开高校)。 若学校信息已经配置，请使用 `cea rm "school"` 清除

## Prerequisites

- NPM

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
  # 文件修改完后仍需执行 `./init.js -u` 加载这些用户，根据提示确保用户已成功加载
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

## Disclaimer

`campusphere-elegant-auth` 用于学习和研究 NodeJS，请勿商用或违法使用。

> 作者: [`beetcb`](https://www.beetcb.com), 邮箱: `i@beetcb.com`
