## 配置文件的创建

首先我们需要在当前工作目录下创建名为 `conf.toml` 的配置文件，该配置文件将在加载后得到如下的数据结构：

  ```ts
  export type UsersConf = {
    notifier?: [`${number}`, string]
    users: Array<UserConfOpts>
  }
  export type UserConfOpts = {
    username: string
    password: string
    captcha?: 'OCR'
    alias: string
    school: string
    addr: Array<string>
  }
  ```

## 配置字段说明

可以很清晰地看到，我们主要配置的是一个用户数组，每个用户有不同地配置项，下面我们就来看看各个配置项：

- `addr`: 配置签到地址，有两种可能的格式

  - `[""]`：表示使用自动获取的学校地址签到
  - `["经度"，"纬度", "中文详细地址"]`：适合在家签到

- `alias`：配置用户简称，用于简化输出，多用户 alias 不能重复

- `username`：学校统一身份验证的账号
- `password`: 学校统一身份验证的密码
- `school`：学校简称，部分学校是英文简称，其它学校是随机字符，请使用 **[学校 ID 查询工具](https://cea.beetcb.com)** 搜索查询
- `captcha`：可选配置项，决定登录时验证码的填写方式，缺省为用户手动填写，填写值只能为 `OCR`，代表使用机器识别自动填写

## 配置格式及语法

我们先来看一个示例：

```toml
[[users]]
username = "11"
password = "11"
alias = "one"
addr = [""]
school = "whpu"
```

`[[users]]` 表示这是 users 数组中的一项，下方内容便是我们之前说的配置字段了，很简单吧

接下来我们看看在家签到的配置方法：

```diff
[[users]]
username = "11"
password = "11"
alias = "one"
-addr = [""]
+addr = ["116.385153","39.997453", "北京市朝阳区安翔路1号"]]
school = "whpu"
```

可以看到，我们修改了 `addr` ，关于具体经纬度的获取，推荐使用 [百度拾取坐标系统](https://api.map.baidu.com/lbsapi/getpoint/index.html) 来查询

接下来我们来添加 1 个用户，使用不同学校：

```diff
[[users]]
username = "11"
password = "11"
alias = "one"
addr = [""]
school = "whpu"

+[[users]]
+username = "22"
+password = "22"
+alias = "two"
+addr = [""]
+school = "whu"
```


跟上面的模式一样，`[[users]]` 表示在用户数组中添加一个 ，然后开始各字段的配置

最重要的用户组配置完毕，我们还可以选择日志推送服务，目前推送是基于微信的，配合 [pushplus](http://pushplus.hxtrip.com/message) 可在几秒钟内完成配置。具体操作是，去 [pushplus](http://pushplus.hxtrip.com/message) 微信登录，获取 `token`，然后修改我们的配置文件，加上 `notifier` 字段：

```diff
# 这里的 0 表示选择推送服务平台的索引是 0，暂时只支持 pushplus 平台，后期可能加入其它平台支持
# 此字段可选的，你也可以不配置此项
+notifier = ["0", "Your Token"]

[[users]]
username = "11"
password = "11"
alias = "one"
addr = [""]
school = "whu"
```


好啦！配置教学到此结束，快去使用起来吧！
