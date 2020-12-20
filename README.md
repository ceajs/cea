<p align="center">
  <a href="https://github.com/beetcb/campushpere-auth-simplified">
    <img src="https://i.imgur.com/vxSM6Nm.gif" alt="test" width="600">
  </a>

  <h3 align="center">campushpere-auth-simplified</h3>
</p>

## About

**campushpere-auth-simplified** 使用交互式的配置程序，实现了学工系统的登录

其返回的 **cookie** 可直接用于学工系统或今日校园相关验证，基于此可以开发更多强大工具集 ( 例如本项目提供的 [今日校园自动签到] 示例 )

## Prerequisites

- NodeJS
- Git

## Get started

1. 安装此项目

```sh
git clone https://github.com/beetcb/campushpere-auth-simplified.git
cd campushpere-auth-simplified && chmod +x init.js
npm i
```

2. 初始化学校及用户

- 学校配置:

  ```sh
  ./init.js -s
  ```

- 用户配置:

  ```sh
  ./init.js -u
  ```

- (可选)使用文件配置用户: 根目录下创建 `userConf.yml`, 参考以下示例:

  ```yml
  # 支持多用户配置,用多数组实现
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
    cookie: 为抓包用户提供便利, 省去登录过程，只需提供 `MOD_AUTH_CAS` 键值, 比如：MOD_AUTH_CAS=aVh237y-K3RPsaST3seDwez1287964
  ```

2. 工具构建:
   本项目提供 **今日校园自动签到** 示例：执行主程序可自动签到。

```sh
node index.js
```

3. 扩展:

   注意: 只需要引入 `crawler/casLogin.js` 作为模块即可获得验证 cookie 信息对象，含 `swms` 和 `campusphere` 参数，分别对应 学工 和 金智教务(今日校园相关) 验证凭据

4. 清空学校配置:

```sh
./init.js rm 'school'
```

## Features

- 交互式配置: `campushpere-awesome-auth` 提供交互式的命令行完成 用户 及 学校 的配置，同时也支持使用 `yml` 文件来配置

- 验证持久化: 缓存验证信息于内存, 只在失效时更新

- 多用户非阻塞: 利用 NodeJS 异步特征，多用户可并行，实现毫秒级的多用户同时操作

## Thanks

登录中加密过程大量参考 [wisedu-unified-login-api](https://github.com/ZimoLoveShuang/wisedu-unified-login-api) 项目，十分感谢

## Disclaimer

`campushpere-auth-simplified` 用于学习和研究 NodeJS，请勿商用或违法使用。

> 作者: [`beetcb`](https://www.beetcb.com), 邮箱: `i@beetcb.com`
