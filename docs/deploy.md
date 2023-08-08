<details><summary>Docker Deployment</summary>

1. 按照 [README.md](https://github.com/ceajs/cea#%E4%BD%9C%E4%B8%BA%E5%91%BD%E4%BB%A4%E8%A1%8C%E4%BD%BF%E7%94%A8) 安装 cea，使用 CLI 配置用户(如果你用配置文件，记得运行 `cea load` 来加载用户)

2. 构建 Image 并运行 Container

   ```bash
   # 在本地构建 Image
   sudo docker build -t cea-check-in https://github.com/ceajs/cea.git#main:docker

   # 创建容器
   sudo docker run --name auto-check-in -dv /tmp/conf:/tmp/conf cea-check-in
   ```

   如果使用境内服务器，由于网络问题，构建可能失败，可以使用本仓库已经构建完成的镜像

   ```bash
   sudo docker run --name auto-check-in -dv /tmp/conf:/tmp/conf ghcr.io/ceajs/cea/cea-check-in:main
   ```

   此容器自动设置了 Cron 任务，将会在每天 6:00 触发执行签到，如需自定义触发时间或开启查寝功能，请 Fork 本仓库(或者 Clone 本仓库)，修改 `docker/cea-cron`，并另行构建镜像与容器

   ```
   # 如果你是 Fork 并 Push 了修改
   sudo docker build -t cea-check-in Fork仓库的GitURL#main:docker

   # 如果你是 Clone 并在本地修改，请进入 docker 文件夹
   sudo docker build -t cea-check-in .

   # 创建容器
   sudo docker run --name auto-check-in -dv /tmp/conf:/tmp/conf cea-check-in
   ```

   </details>

<details><summary>Tencent Cloud One-click Deployment</summary>

> 本说明帮助你**一键部署**自动签到程序到腾讯云开发
>
> **未开通云开发&新注册用户**需要先开通云开发，具体过程为：在 [此地址](https://console.cloud.tencent.com/tcb?from=12335) 注册登录，完成后再进入 [开通地址](https://console.cloud.tencent.com/tcb?from=12335) 开通 ⇢ <strong>不创建环境(请勾选)</strong>，其它默认 ⇢ 跳转到授权界面并授权，开通成功

[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fceajs%2Fcea&branch=main)

1. 点击 ☝ 部署按钮 ⇢ 登录腾讯云 ⇢ <strong>使用免费资源(记得勾选)</strong>
   ⇢ `环境名称` 填入 cea ⇢ 下一步 ⇢ 完成

2. 等待几秒(部署完成后) ⇢ 左栏 `云函数` ⇢ 点击 `cea` 进入此函数配置界面 ⇢ `函数代码` 拦下在线编辑器里修改 `conf.toml` 文件 ⇢ 请参考[配置文件说明](./config.md)请自行填入 ⇢ 先**保存**后测试，无报错则成功部署

   > 如需开启查寝功能，请在腾讯云在线编辑器内删除掉 `index.js` 里相关注释，并在定时任务配置里加上查寝的时间

3. 教程结束 ⚡ (如有问题，请附带日志提交 issue)，此函数会自动在每天 6:00 执行签到

  </details>

<details><summary>GitHub Actions (Currently Disabled)</summary>

> 考虑到 GitHub 近期对 Actions 监管（并且部分学校限制国外主机访问），本项目将禁用 Actions 部署

  </details>

<details><summary>Server Deployment</summary>

1. 按照 [README.md](https://github.com/ceajs/cea#%E4%BD%9C%E4%B8%BA%E5%91%BD%E4%BB%A4%E8%A1%8C%E4%BD%BF%E7%94%A8) 安装 cea，配置用户

2. 正确配置 cron 服务，以下命令仅供参考

   ```bash
   # 将NPM全局包的PATH加入下方路径
   PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin
   0 6 * * * /usr/local/bin/node /usr/local/bin/cea sign
   0 21 * * * /usr/local/bin/node /usr/local/bin/cea attendance
   # empty 
   ```

  </details>