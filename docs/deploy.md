
<details><summary>Docker 部署</summary>

1. 按照 [README.md](https://github.com/ceajs/cea#%E4%BD%9C%E4%B8%BA%E5%91%BD%E4%BB%A4%E8%A1%8C%E4%BD%BF%E7%94%A8) 安装 cea，使用 CLI 配置用户(如果你用配置文件，记得运行 `cea load` 来加载用户)

2. 构建 Image 并运行 Container

   ```bash
   sudo docker build -t cea-check-in https://github.com/ceajs/cea.git#main:docker
   
   sudo docker run -dv /tmp/conf:/tmp/conf cea-check-in
   ```

  </details>

<details><summary>腾讯云开发一键部署</summary>

> 本说明帮助你**一键部署**自动签到程序到腾讯云开发
>
> **未开通云开发&新注册用户**需要先开通云开发，具体过程为：在 [此地址](https://console.cloud.tencent.com/tcb?from=12335) 注册登录，完成后再进入 [开通地址](https://console.cloud.tencent.com/tcb?from=12335) 开通 ⇢ <strong>不创建环境(请勾选)</strong>，其它默认 ⇢ 跳转到授权界面并授权，开通成功

[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fceajs%2Fcea&branch=main)

1. 点击 ☝ 部署按钮 ⇢ 登录腾讯云 ⇢ <strong>使用免费资源(记得勾选)</strong>
   ⇢ `环境名称` 填入 cea ⇢ 下一步 ⇢ 完成

2. 等待几秒(部署完成后) ⇢ 左栏 `云函数` ⇢ 点击 `cea` 进入此函数配置界面 ⇢ `函数代码` 拦下在线编辑器里修改 `conf.toml` 文件 ⇢ 请参考[配置文件说明](./config.md)请自行填入 ⇢ 先**保存**后测试，无报错则成功部署

3. 教程结束 ⚡ (如有问题，请附带日志提交 issue)，此函数会自动在每天 6:00 触发

  </details>

<details><summary>GitHub Actions</summary>

> 考虑到 GitHub 近期对 Actions 监管（并且部分学校限制国外主机访问），本项目将禁用 Actions 部署
  </details>

<details><summary>服务器部署</summary>

1. 按照 [README.md](https://github.com/ceajs/cea#%E4%BD%9C%E4%B8%BA%E5%91%BD%E4%BB%A4%E8%A1%8C%E4%BD%BF%E7%94%A8) 安装 cea，配置用户

2. 正确配置 cron 服务，以下命令仅供参考

   ```bash
   0 6 * * * /usr/local/bin/node /usr/local/bin/cea sign
   ```

  </details>
