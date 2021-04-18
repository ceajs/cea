**三种部署方式的区别**

1. GitHub Actions：部署过程最简单（但少部分学校域名禁止海外 IP 访问，可能需要代理登录服务器），**向前兼容**，不必担心今日校园更新导致签到失效

2. 云开发：签到最快，但需要实名认证; **无法向前兼容，需手动更新**，参考 [#27](https://github.com/beetcb/cea/issues/27) 

3. Coding：部署和签到速度相对较快，过程相对繁琐，**向前兼容**

<details><summary>Github Actions 部署</summary>

部署教程如下：

1. 右上角 Fork 本项目(可以顺手 Star ✨ 支持一下，谢谢)

2. Fork 下来的项目默认是关闭 Actions 的，需要手动开启：单击 Actions，按下图开启 cea 这个 GitHub Action：
   ![enable workflows](https://i.imgur.com/1myiezK.png)
   ![enable cea action](https://i.imgur.com/RQ4gEJA.png)

3. 配置签到信息：单击 Settings ，在左侧边栏中，单击 Secrets，单击 New repository secret 开始创建签到信息

   ![actions](https://i.imgur.com/Lx6319H.png)
   ![secret](https://i.imgur.com/nODikvG.png)

**你需要添加 2 个 secrets，他们的示例如下：**

> **users 的值默认都以一个空格分隔，多用户使用 显示换行(`\n`) 分割**

> **school 的值可为英文简称，可为中文全称**

- `users`: e.g. `123 321 beet`(请在以下三种配置方式中选择一种)
  - `用户名 密码 名称` 用学校地址签到
  - `用户名 密码 名称 home` 在家用随机地址签到
  - `用户名 密码 名称 home 经度 纬度 中文地址` 在家用自定义的经纬度和地址签到，请使用[此工具](https://api.map.baidu.com/lbsapi/getpoint/index.html)生成经纬度
- `school`: e.g. `whpu` 学校的英文简称（推荐，部分学校支持，请查阅[支持英文简称的学校列表](https://github.com/beetcb/cea/blob/master/docs/abbrList.sh)自行判断）或中文全称（备用选项，所有学校都支持）

4. 通过给自己仓库 Star 来测试 Actions 是否执行成功

   ![star](https://i.imgur.com/83UE7lr.png)

配置成功后，此操作会自动在每天 6:00 触发，尝试签到

  </details>

<details><summary>腾讯云开发一键部署</summary>

> 本说明帮助你**一键部署**自动签到程序到腾讯云开发
>
> **未开通云开发&新注册用户**需要先开通云开发，具体过程为：在 [此地址](https://console.cloud.tencent.com/tcb?from=12335) 注册登录，完成后再进入 [开通地址](https://console.cloud.tencent.com/tcb?from=12335) 开通 ⇢ <strong>不创建环境(请勾选)</strong>，其它默认 ⇢ 跳转到授权界面并授权，开通成功

[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fbeetcb%2Fcea&branch=master)

1. 点击 ☝ 部署按钮 ⇢ 登录腾讯云 ⇢ <strong>使用免费资源(记得勾选)</strong>
   ⇢ `环境名称` 填入 cea ⇢ 下一步 ⇢ 完成

2. 等待几秒(部署完成后) ⇢ 左栏 `云函数` ⇢ 点击 `cea` 进入此函数配置界面 ⇢ `函数代码` 拦下在线编辑器里修改 `conf.toml` 文件 ⇢ 相应注释都已写好，请自行填入 ⇢ 先**保存**后测试，无报错则成功部署

   ![示例](https://i.imgur.com/co0zWxh.png)

3. 教程结束 ⚡ (如有问题，请附带日志提交 issue)，此函数会自动在每天 6:00 触发，具体的配置文件示例如下：

   ```toml
   # 学校的英文简称（推荐，部分学校支持，请参阅[支持英文简称的学校列表](https://github.com/beetcb/cea#abbrlist)自行判断）或中文全称（备用选项，所有学校都支持）
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

   只需填入仓库 URL：`https://github.com/beetcb/cea.git`，完成创建

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

   > **users 的值默认都以一个空格分隔，多用户使用 显示换行(`\n`) 分割**

   > **school 的值可为英文简称，可为中文全称**

   - `users`: e.g. `123 321 beet`(请在以下三种配置方式中选择一种)
     - `用户名 密码 名称` 用学校地址签到
     - `用户名 密码 名称 home` 在家用随机地址签到
     - `用户名 密码 名称 home 经度 纬度 中文地址` 在家用自定义的经纬度和地址签到，请使用[此工具](https://api.map.baidu.com/lbsapi/getpoint/index.html)生成经纬度
   - `school`: e.g. `whpu` 学校的英文简称（推荐，部分学校支持，请查阅[支持英文简称的学校列表](https://github.com/beetcb/cea/blob/master/docs/abbrList.sh)自行判断）或中文全称（备用选项，所有学校都支持）

   5. ~~此操作会自动在每天 6:00 触发~~ Coding 目前不支持自动配置触发，你需要手动设置触发机制：单击触发机制，下滑添加定时触发，按照 Coding 的逻辑，你需要设置三次触发，分别是 6:00 ，当然你也可以自定义，图例如下

   ![tigger](https://i.imgur.com/xYHsISg.png)

   6. 配置成功后，请手动触发一次来测试配置的正确性

  </details>
