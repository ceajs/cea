## 配置文件的路径

Cea 默认配置文件在当前工作根目录下，并命名为 `conf.toml`

- **使用命令行加载配置**：可以通过 `cea load [filepath]` 中 `filepath` 指定配置文件地路径
- **使用代码执行签到**：无需手动配置，Cea 会自动加载默认路径下的配置文件(以防配置文件变动更新)，此方式不可自定义路径

## 配置字段说明

配置文件采用如下的数据结构：

```ts
type UsersConf = {
  readonly notifier?: [`${number}`, string, string]
  readonly localEdgeCasesFile: string
  readonly users: Array<UserConfOpts>
}

type UserConfOpts = {
  addr: [''] | [string, string, string]
  readonly username: string
  readonly password: string
  readonly alias: string
  readonly school: string
  readonly retry?: number
  readonly captcha?: 'MANUAL' | 'OCR'
  readonly signedDataMonth?: `${number}-${number}`
}
```

可以很清晰地看到，我们主要配置的是一个用户数组，每个用户有不同地配置项，下面我们就来看看各个配置项：

- `addr`: 配置签到地址，有两种可能的格式
  - `[""]`：表示使用自动获取的学校地址签到
  - `["经度"，"纬度", "中文详细地址"]`：适合自定义(或在家)签到
- `alias`：配置用户简称，用于简化输出，多用户 alias 不能重复
- `username`：学校统一身份验证的账号
- `password`: 学校统一身份验证的密码
- `school`：学校简称，部分学校是英文简称，其它学校是随机字符，请使用 **[学校 ID 查询工具](https://schoolid.vercel.app)** 搜索查询
- `captcha`：可选配置项，决定登录时验证码的填写方式，缺省为 `OCR`，可填写 `MANUAL`，代表人工手动填写(交互式)
- `retry`：可选配置项，决定登录重试次数，缺省为 `1`，表示总共只登录一次，当登录有滑块/图片验证码时可适当增加此值
- `signedDataMonth`: 可选配置项，指定 `年份-月份`(`YYYY-MM`) 用于查寝、签到、信息收集时查找成功的历史签到作为填表模板，缺省值为最新年月份(1月或1日会自动回溯到去年/上月)

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

接下来我们看看在家签到(或者说自定义签到地址)的配置方法：

```diff
[[users]]
username = "11"
password = "11"
alias = "one"
-addr = [""]
+addr = ["116.385153","39.997453", "北京市朝阳区安翔路1号"]
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

最重要的用户组配置完毕，我们还可以选择**日志推送服务**，目前推送是基于微信的，配合 [pushplus](http://pushplus.hxtrip.com/message) 可在几秒钟内完成配置。具体操作是，去 [pushplus](http://pushplus.hxtrip.com/message) 微信登录，获取 `token`，然后修改我们的配置文件，加上 `notifier` 字段：

```diff
# notifier 字段可选的，你也可以不配置此项
# 这里的 0 表示选择推送服务平台的索引是 0，暂时只支持 pushplus 平台，后期可能加入其它平台支持
# 对于一对多的情况, 请在 push plus 中配置一对多，填入 topic 值
+notifier = ["0", "Your Token", "topic"]

[[users]]
username = "11"
password = "11"
alias = "one"
addr = [""]
school = "whu"
```

对于<strong id="edge_link">在云平台部署 Cea</strong>或者**想自定义学校边缘情形**的用户，请配置 `localEdgeCasesFile` 字段为本地自定义 JSON 文件的路径，文件内容请参考 [./vercel/data/school-edge-cases.json](https://github.com/ceajs/cea/blob/main/vercel/data/school-edge-cases.json) 文件

> 对与部署到云平台的配置，Cea 默认内置好了 `localEdgeCasesFile`，对应最新的学校边缘情形文件，这将大幅度加快学校加载响应、降低 API 负载

除此之外，对于签到需要上传图片的情况，请确保至少成功签到过一次，然后配置好 signedDataMouth 字段：

```diff
notifier = ["0", "Your Token", "topic"]

[[users]]
username = "11"
password = "11"
alias = "one"
addr = [""]
school = "whu"
# 填入成功历史签到中存在成功签到的月份，格式严格遵循 YYYY-MM，默认值为 2020-11，如果你在此月有成功签到记录，可以省此字段的配置
+signedDataMonth = "2021-10"
```

好啦！配置教学到此结束，快去使用起来吧！