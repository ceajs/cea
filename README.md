<p align="center">
  <a href="https://github.com/beetcb/campusphere-elegant-auth">
    <img src="https://s4.gifyu.com/images/cea.gif" alt="test" width="600">
  </a>

<strong><p align="center"><code>c</code>ampusphere-<code>e</code>legant-<code>a</code>uth</p></strong>

<p align="center">
 <a align="center" href="https://www.npmjs.com/package/@beetcb/cea">
    <img alt="npm" src="https://img.shields.io/npm/v/@beetcb/cea">
  </a>
</p>

  <p align="center">
  交互式的配置程序 + 学工系统多用户并发登录 + 云端部署及缓存
  <br>
  其返回的 <strong>cookie</strong> 可直接用于学工系统或今日校园相关验证
  <br>
  基于此可以开发更多强大工具集 ( 例如本项目提供的 [今日校园自动签到] 示例 )
  <p>
</p>

## Features

- 新增一键部署签到程序：依赖自动安装、触发器自动配置，可能是全网最快、选择最多的部署 👇 (我们支持三种配置方式，请按需选择，点击左边小三角展开教程)
    <details><summary>三种部署方式的区别</summary>

  1. GitHub Actions：部署过程最简单，但少部分学校域名禁止海外 IP 访问，会签到失败( WHPU 的同学们不用担心，我通过代理中转修复了这个问题)

  2. 云开发：签到最快，但需要实名认证

  3. Coding：部署和签到速度相对较快
  </details>
  <details><summary>Github Actions 部署</summary>

  部署教程如下：

  1. 右上角 Fork 本项目(可以顺手 Star ✨ 支持一下，谢谢)

  2. Fork 下来的项目默认是关闭 Actions 的，需要手动开启：单击 Actions，按下图开启 cea 这个 GitHub Action：
     ![enable workflows](https://i.imgur.com/1myiezK.png)
     ![enable cea action](https://i.imgur.com/RQ4gEJA.png)

  3. 配置签到信息：单击 Settings ，在左侧边栏中，单击 Secrets，单击 New repository secret 开始创建签到信息

     ![actions](https://i.imgur.com/Lx6319H.png)
     ![secret](https://i.imgur.com/aM4jUSW.png)

  **你需要添加 2 个 secrets，他们的示例如下：**

  > **users 的值默认都以一个空格分隔，多用户使用 显示换行(`\n`) 分割**

  - `users`: e.g. `123 321 beet`(请在以下三种配置方式中选择一种)
    - `用户名 密码 名称` 用学校地址签到
    - `用户名 密码 名称 home` 在家用随机地址签到
    - `用户名 密码 名称 home 经度 纬度 中文地址` 在家用自定义的经纬度和地址签到，请使用[此工具](https://api.map.baidu.com/lbsapi/getpoint/index.html)生成经纬度
  - `school`: e.g. `whpu` 学校的英文简称（推荐，部分学校支持，请查阅[支持英文简称的学校列表](https://github.com/beetcb/cea#abbrlist)自行判断）或中文全称（备用选项，所有学校都支持）

  3. 通过给自己仓库 Star 来测试 Actions 是否执行成功

     ![star](https://i.imgur.com/HHlLA4P.png)

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

     - `users`: e.g. `123 321 beet`(请在以下三种配置方式中选择一种)
       - `用户名 密码 名称` 用学校地址签到
       - `用户名 密码 名称 home` 在家用随机地址签到
       - `用户名 密码 名称 home 经度 纬度 中文地址` 在家用自定义的经纬度和地址签到，请使用[此工具](https://api.map.baidu.com/lbsapi/getpoint/index.html)生成经纬度
     - `school`: e.g. `whpu` 学校的英文简称（推荐，部分学校支持，请查阅[支持英文简称的学校列表](https://github.com/beetcb/cea#abbrlist)自行判断）或中文全称（备用选项，所有学校都支持）

     5. ~~此操作会自动在每天 6:00 触发~~ Coding 目前不支持自动配置触发，你需要手动设置触发机制：单击触发机制，下滑添加定时触发，按照 Coding 的逻辑，你需要设置三次触发，分别是 6:00 ，当然你也可以自定义，图例如下

     ![tigger](https://i.imgur.com/xYHsISg.png)

     6. 配置成功后，请手动触发一次来测试配置的正确性

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

- 验证持久化: 缓存验证信息于内存, 只在失效时登录并更新；云端和本地缓存能力来源于我的另一个项目 [sstore](https://github.com/beetcb/sstore)

- 兼容云服务的 OCR：很多云服务(如云函数)的文件系统并不都是可写入的，我们将 OCR 验证码识别用到的 [tesseract.js](https://github.com/naptha/tesseract.js) 数据包和训练缓存包暂存到了 `/tmp`，降低出错率；同时，为加快国内访问速度，下载节点托管于码云

- 多用户非阻塞: 利用 NodeJS 异步特征，多用户可并行，实现毫秒级的多用户同时操作

- 关于签到: (学校配置时)使用百度地图 API 获取学校全局签到地址, 使用今日校园接口返回的签到数据获取签到经纬度, 简单来说, 只需知道学校英文简称即可配置好所有签到信息, 充分懒人化

## Prerequisites

- NPM
- NodeJS

### Compatibility

适用于 whpu (已测试) 和其它 大多数学校(未测试，如有问题，请附带日志提交 [Issue](https://github.com/beetcb/cea/issues/new/choose) 或 [PR](https://github.com/beetcb/cea/pulls))

<details id="abbrlist"><summary>支持使用英文简称的学校列表如下</summary>
  <pre>
  空军工程大学 afeu
  安徽国际商务职业学院 ahiib
  安徽建筑大学 ahjzu
  安徽粮食工程职业学院 ahlsxy
  安徽师范大学 ahnu
  安徽邮电职业技术学院 ahptc
  安徽工程大学 ahpu
  安徽水利水电职业技术学院 ahsdxy
  安徽审计职业学院 ahsjxy
  安徽体育运动职业学院 ahty
  安徽工业大学 ahut
  安庆师范大学 aqnu
  鞍山师范学院 asnc
  安顺学院 asu
  安阳工学院 ayit
  北京农学院 bac
  北京社会管理职业学院 bcsa
  北京舞蹈学院 bda
  北华大学 beihua
  北京工业职业技术学院 bgy
  北京服装学院 bift
  北京信息科技大学 bistu
  北京理工大学 bit
  北京市商业学校 bjsx
  北京工业大学 bjut
  宝鸡文理学院 bjwlxy
  北京语言大学 blcu
  北京师范大学·珠海 bnuz
  北京体育大学 bsu
  保山中医药高等专科学校 bszyz
  包头轻工职业技术学院 btqy
  包头师范学院 bttc
  泊头职业学院 btzyxy
  北京航空航天大学 buaa
  北京建筑大学 bucea
  北京邮电大学 bupt
  北京物资学院 bwu
  滨州医学院 bzmc
  滨州职业学院 bzpt
  中央美术学院 cafa
  长春汽车工业高等专科学校 caii
  北京工商大学嘉华学院 canvard
  成都航空职业技术学院 cap
  中国民航大学 cauc
  山东工商学院 ccec
  长春工程学院 ccit
  常州信息职业技术学院 ccit.js
  重庆建筑工程职业学院 cctc
  长春大学 ccu
  长春财经学院 ccufe
  长春工业大学 ccut
  湖南幼儿师范高等专科学校 cdgdsf
  四川师范大学 cdnu
  电子科技大学成都学院 cduestc
  成都理工大学 cdut
  成都中医药大学 cdutcm
  成都工业学院 cec
  赤峰学院 cfxy
  长安大学 chd
  巢湖学院 chu
  滁州学院 chzu
  中国劳动关系学院 ciir
  山西农业大学信息学院 cisau
  长江工程职业技术学院 cj-edu
  中国计量大学 cjlu
  长江职业学院 cjxy
  长春师范大学 cncnc
  四川护理职业学院 cnsnvc
  首都师范大学 cnu
  中国人民公安大学 cppsu
  重庆电子工程职业学院 cqcet
  重庆广播电视大学 cqdd
  重庆交通大学 cqjtu
  重庆医科大学 cqmu
  重庆师范大学 cqnu
  重庆工商职业学院 cqtbi
  重庆大学 cqu
  重庆第二师范学院 cque
  重庆邮电大学 cqupt
  重庆科技学院 cqust
  重庆理工大学 cqut
  重庆文理学院 cqwu
  陕西国际商贸学院 csiic
  长沙师范学院 cssf
  中南大学 csu
  三峡大学 ctgu
  南广学院 cucn
  中央财经大学 cufe
  中国地质大学 cug
  成都信息工程大学 cuit
  中国矿业大学 cumt
  长春职业技术学院 cvit
  西华师范大学 cwnu
  中华女子学院 cwu
  中国青年政治学院 cyu
  滁州城市职业学院 czcvc
  池州职业技术学院 czgz
  常州工业职业技术学院 czili
  长治医学院 czmc
  大理大学 dali
  东华大学 dhu
  北京电子科技职业学院 dky
  大连医科大学 dlmedu
  大连海事大学 dlmu
  大连外国语大学 dlufl
  昆山登云科技职业学院 dyc
  德州职业技术学院 dzvtc
  江苏省电化教育馆 ecjs
  华东交通大学 ecjtu
  华东师范大学 ecnu
  华东政法大学 ecupl
  火箭军工程大学 epgc
  上海东海职业技术学院 esu
  福建农林大学 fafu
  南方医科大学 fimmu
  福建江夏学院 fjjxu
  福建医科大学 fjmu
  福建广播电视大学 fjrtvu
  福建中医药大学 fjtcm
  福建生物工程职业技术学院 fjvcb
  第四军医大学 fmmu
  佛山科学技术学院 fosu
  阜阳师范学院信息工程学院 fync
  福州外语外贸学院 fzfu
  闽江师范高等专科学校 fzjyxy
  福州大学 fzu
  防灾科技学院 fzxy
  甘肃建筑职业技术学院 gcvtc
  广东交通职业技术学院 gdcp
  广东工贸职业技术学院 gdgm
  广东文艺职业学院 gdla
  广东医科大学 gdmu
  广东轻工职业技术学院 gdqy
  广东理工职业学院 gdrtvu
  广东财经大学 gdufe
  广东工业大学 gdut
  上海建桥学院 gench
  贵州理工学院 git
  桂林医学院 glmc
  桂林师范高等专科学校 glnc
  桂林旅游学院 gltu
  扬州大学广陵学院 glxy
  贵州医科大学 gmc
  甘肃农业大学 gsau
  甘肃省委党校 gsdx
  甘肃中医学院 gszy
  广西电力职业技术学院 gxdlxy
  广西建设职业技术学院 gxjsxy
  广西科技师范学院 gxlztc
  广西农业职业技术学院 gxnyxy
  广西体育高等专科学校 gxtznn
  广西民族大学 gxun
  柳州工学院 gxut
  广西卫生职业技术学院 gxwzy
  贵州商学院 gzcc
  广州城建职业学院 gzccc
  贵州电子信息职业技术学院 gzeic
  贵州师范大学 gznu
  番禺职业技术学院 gzpyp
  贵州轻工职业技术学院 gzqy
  贵州大学 gzu
  广州中医药大学 gzucm
  河南中医药大学 hactcm
  河南财政金融学院 hacz
  河南工业大学 haut
  河北美术学院 hbafa
  湖北工程职业学院 hbei
  河北建材职业技术学院 hbjcxy
  河北机电职业技术学院 hbjd
  湖北师范大学 hbnu
  湖北理工学院 hbpu
  河北软件职业技术学院 hbsi
  湖北水利水电职业技术学院 hbsy
  河北大学 hbu
  湖北经济学院 hbue
  湖北科技学院 hbust
  湖北工业大学 hbut
  鹤壁职业技术学院 hbzy
  江苏电子信息职业学院 hcit
  杭州电子科技大学 hdu
  河北化工医药职业技术学院 hebcpc
  河北北方学院 hebeinu
  河北师范大学汇华学院 hebtu
  河南师范大学 henannu
  河南大学 henu
  河北经贸大学 heuet
  合肥师范学院 hfnu
  黄冈师范学院 hgnc
  内蒙古化工职业学院 hgzyxy
  淮海工学院 hhit
  黄河科技学院 hhstu
  河海大学 hhu
  怀化职业技术学院 hhvtc
  河北大学工商学院 hicc
  河南科技学院 hist
  哈尔滨工业大学 hit
  哈尔滨工业大学（威海） hitwh
  黑龙江工程学院 hljit
  黑龙江大学 hlju
  长沙商贸旅游职业技术学院 hncpu
  河南工学院 hneeu
  湖南第一师范学院 hnfnu
  河南省外贸学校 hnfts
  湖南工程职业技术学院 hngcjx
  湖南化工职业技术学院 hnhgzy
  湖南工程学院 hnie
  湖南信息职业技术学院 hniu
  河南机电职业学院 hnjd
  湖南机电职业技术学院 hnjdzy
  河南经贸职业学院 hnjmxy
  湖南交通职业技术学院 hnjtzy
  湖南科技职业技术学院 hnkjxy
  湖南女子学院 hnnd
  淮南师范学院 hnnu
  河南警察学院 hnp
  河南司法警官职业学院 hnsfjy
  海南省卫生学校 hnswsxx
  湖南铁路科技职业技术学院 hntky
  河南牧业经济学院 hnuahe
  湖南商学院 hnuc
  河南职业技术学院 hnzj
  河南理工大学 hpu
  华侨大学 hqdx
  哈尔滨商业大学 hrbcu
  哈尔滨金融学院 hrbfu
  哈尔滨体育学院 hrbipe
  哈尔滨师范大学 hrbnu
  哈尔滨理工大学 hrbust
  韩山师范学院 hstc
  合肥职业技术学院 htc
  湖南高速铁路职业技术学院 htcce
  湖北汽车工业学院 huat
  湖北科技职业学院 hubstc
  湖北大学 hubu
  河南财经政法大学 huel
  湖南工业职业技术学院 hunangy
  湖南农业大学 hunau
  湖南师范大学 hunnu
  华中科技大学 hust
  河西学院 hxu
  淮阴工学院 hyit
  淮阴师范学院 hytc
  浙江工商大学 hzic
  杭州科技职业技术学院 hzpt
  贺州学院 hzu
  内蒙古农业大学 imau
  内蒙古电子信息职业技术学院 imeic
  内蒙古警察职业学院 imppc
  内蒙古财经大学 imufe
  内蒙古科技大学 imust
  内蒙古工业大学 imut
  内蒙古商贸职业学院 imvcc
  苏州工业园区职业技术学院 ivt
  吉林省经济管理干部学院 jemcc
  解放军理工大学 jfjlg
  金华职业技术学院 jhc
  江海职业技术学院 jhu
  江汉大学 jhun
  金陵科技学院 jit
  九江职大 jjvu
  吉林省艺术学院 jlart
  吉林工商学院 jlbtc
  吉林医药学院 jlmu
  吉林师范大学 jlnu
  吉林司法警官职业学院 jlsfjy
  吉林工程技术师范学院 jltiet
  吉林大学 jlu
  江苏海事职业技术学院 jmi
  济南工程职业技术学院 jngcxy
  济宁医学院 jnmc
  暨南大学 jnu
  济宁学院 jnxy
  常州大学 jpu
  今日大学 jrdx
  江苏城乡建设职业学院 js-cj
  江苏农林职业技术学院 jsafc
  江苏财会职业学院 jscfa
  江苏财经职业技术学院 jscjxy
  无锡科技职业学院 jseea
  江苏食品药品职业技术学院 jsfsc
  江苏第二师范学院 jsie
  江苏信息职业技术学院 jsit
  江苏建筑职业技术学院 jsjzi
  江苏建康职业学院 jssmu
  江苏省宿迁卫生中等专业学校 jssqwx
  苏州市职业大学 jssvc
  江苏省委党校 jsswdx
  江苏安全技术职业学院 jsvist
  北京交通职业技术学院 jtxy
  江苏科技大学 just
  江苏开放大学 jx.jsou
  江西农业大学 jxau
  江西信息应用职业技术学院 jxcia
  江西警察学院 jxga
  江西省高校师资培训中心 jxgspx
  南昌师范学院 jxie
  江西建设职业技术学院 jxjsxy
  江西交通职业技术学院 jxjtxy
  江西旅游商贸职业学院 jxlsxy
  江西师范大学 jxnu
  江西省轻工业高级技工学校 jxqgjx
  江西师范高等专科学校 jxsfgz
  江西财经大学 jxufe
  江西理工大学 jxust
  江西科技学院 jxut
  江西中医药大学 jxutcm
  江西现代职业技术学院 jxxdxy
  江西应用技术职业学院 jxyyxy
  江阴职业技术学院 jypc
  冀中职业学院 jzhxy
  荆州理工职业学院 jzlg
  金智学习云 jzxxy
  空军空降兵学院 kjkjbxy
  昆明学院 kmu
  聊城大学 lcu
  聊城大学东昌学院 lcudc
  鲁东大学 ldu
  廊坊职业技术学院 lfzhjxy
  洛阳理工学院 lit
  辽宁林业职业技术学院 lnlzy
  辽宁农业职业技术学院 lnnzy
  辽宁轻工职业学院 lnqg
  辽宁商贸职业学院 lnsmzy
  辽宁生态工程职业学院 lnstzy
  辽宁工程技术大学 lntu
  乐清职业中等专科学校 lqzz
  乐山师范学院 lstc
  丽水职业技术学院 lszjy
  连云港职业技术学院 lygtc
  洛阳师范学院 lynu
  临沂大学 lyu
  龙岩学院 lyun
  洛阳职业技术学院 lyvtc
  兰州财经大学 lzufe
  牡丹江技师学院 mdjjsxy
  牡丹江医学院 mdjmu
  福建信息职业技术学院 mitu
  闽江学院 mju
  南京审计大学 nau
  宁波职业技术学院 nbtp
  宁波广播电视大学 nbtvu
  宁波大学 nbu
  南京城市职业学院 ncc
  华北电力大学(北京) ncepu
  南昌航空大学 nchu
  华北科技学院 ncist
  南昌师范高等专科学校 nctc
  南昌大学 ncu
  北方工业大学 ncut
  华北水利水电大学 ncwu
  宁德职业技术学院 ndgzy
  宁德师范学院 ndsy
  东北林业大学 nefu
  东北师范大学 nenu
  东北大学 neu
  大连东软信息学院 neusoft
  广东南华工商职业学院 nhic
  南京工业职业技术学院 niit
  南京机电职业技术学院 nimt
  南昌工程学院 nit
  浙江大学宁波理工学院 nit.net
  南京旅游职业学院 nith
  南京艺术学院 njarti
  南京农业大学 njau
  南京信息职业技术学院 njcit
  南京林业大学 njfu
  南京高等职业技术学校 njgzx
  南京工程学院 njit
  南京交通职业技术学院 njitt
  南京医科大学 njmu
  南京师范大学 njnu
  南京工业大学浦江学院 njpji
  南京铁道职业技术学院 njrts
  南京工业大学 njtech
  南京特殊教育师范学院 njts
  南京广播电视大学 njtvu
  南京大学 nju
  南京财经大学 njue
  南京邮电大学 njupt
  南京晓庄学院 njxz
  南京理工大学紫金学院 njyjdz
  黑龙江农垦职业学院 nkzy
  内蒙古交通职业技术学院 nmjtzy
  成都东软学院 nsu
  南通科技职业学院 ntac
  江苏商贸职业学院 ntgx
  南通师范高等专科学校 ntnc
  南通航运职业技术学院 ntsc
  南通职业大学 ntvu
  国防科技大学 nudt
  南京信息工程大学 nuist
  广东东软学院 nuit
  西北师范大学 nwnu
  西北工业大学 nwpu
  北方民族大学 nwsni
  西北农林科技大学 nwsuaf
  西北大学 nwu
  宁夏工商职业技术学院 nxgs
  宁夏医科大学 nxmu
  宁夏职业技术学院 nxtc
  宁夏大学 nxu
  南阳理工学院 nyist
  南阳师范学院 nytc
  鄂尔多斯职业学院 ordosvc
  中国海洋大学 ouc
  平顶山学院 pdsnc
  盘锦职业技术学院 pjzy
  北京大学深圳研究生院 pkusz
  甘肃医学院 plmc
  莆田学院 ptu
  濮阳医学高等专科学校 pyyzh
  青岛农业大学 qau
  青岛大学 qdu
  曲阜师范大学 qfnu
  青海大学 qhu
  青海卫生职业技术学院 qhwszy
  齐鲁医药学院 qlmu
  齐齐哈尔医学院 qmu
  齐齐哈尔高等师范专科学校 qqhrtc
  青岛职业技术学院 qtc
  青岛理工大学 qtech
  青岛科技大学 qust
  上海工艺美术职业学院 sada.sh
  上海杉达学院 sandau
  四川文理学院 sasu
  上海商学院 sbs
  四川建筑职业技术学院 scatc
  华南农业大学 scau
  四川汽车职业技术学院 scavtc
  四川工程职业技术学院 scetc
  四川美术学院 scfai
  华南师范大学 scnu
  上海科学技术职业学院 scst
  四川旅游学院 sctu
  四川民族学院 scun
  华南理工大学 scut
  四川职业技术学院 sczyxy
  山东工艺美术学院 sdada
  山东行政学院 sdai
  山东农业大学 sdau
  山东商务职业学院 sdbi
  山东省城市技师服务学校 sdcc
  山东电子职业技术学院 sdcet
  中共山东省委党校 sddx
  山东华宇工学院 sdhyxy
  齐鲁工业大学 sdili
  山东交通学院 sdjtu
  上海电机学院 sdju
  山东建筑大学 sdjzu
  山东医学高等专科学校 sdmc
  山东管理学院 sdmu
  山东体育学院 sdpei
  顺德职业技术学院 sdpt
  山东司法警官职业学院 sdsfjy
  山东大学 sdu
  山东理工大学 sdut
  山东外贸职业学院 sdwm
  山东协和学院 sdxiehe
  山东青年政治学院 sdyu
  东南大学 seu
  首钢工学院首钢技师学院 sgjx
  黔南民族师范学院 sgmtu
  上海民航职业技术学院 shcac
  复旦大学 shfd
  上海外国语大学 shisu
  上海市教育委员会信息中心 shmec
  上海海事大学 shmtu
  上海师范大学 shnu
  上海海洋大学 shou
  上海交通大学医学院 shsmu
  上海开放大学 shtvu
  上海财经大学 shufe
  上海政法学院 shupl
  上海中医药大学 shutcm
  上海行健职业学院 shxj
  绥化学院 shxy
  上海市行政管理学校 shxzgl
  郑州大学西亚斯国际学院 sias
  四川农业大学 sicaup
  山东商业职业技术学院 sict
  沈阳工程学院 sie
  苏州工业职业技术学院 siit
  苏州工业园区服务外包职业学院 siso
  四川外国语大学 sisu
  四川化工职业技术学院 sjhgjs
  上海交通大学 sjtu
  三江学院 sju
  石家庄理工职业学院 sjzlg
  沈阳建筑大学 sjzu
  商洛学院 slxy
  辽宁水利职业学院 sngzy
  陕西学前师范学院 snie
  陕西中医药大学 sntcm
  陕西理工大学 snut
  上海出版印刷高等专科学校 sppc
  宿迁学院 sqc
  新乡医学院三全学院 sqmc
  商丘师范学院 sqnc
  商丘医学高等专科学校 sqyx
  商丘职业技术学院 sqzy
  上海第二工业大学 sspu
  上海戏剧学院 sta
  上海师范大学天华学院 sthu
  上海电子信息职业技术学院 stiei
  苏州大学 suda
  上海工程技术大学 sues
  上海对外经贸大学 suibe
  上海健康医学院 sumhs
  上海体育学院 sus
  南方科技大学 sustc
  西南交通大学 swjtu
  西南交通大学希望学院 swjtuhc
  西南财经大学 swufe
  西南民族大学 swun
  西南科技大学 swust
  山西农业大学 sxau
  陕西艺术职业学院 sxavc
  山西工程职业技术学院 sxgy
  山西工程技术学院 sxit
  陕西警官职业学院 sxjgxy
  晋中师范高等专科学院 sxjzsf
  晋中学院 sxjztc
  山西医科大学 sxmu
  山西师范大学 sxnu
  陕西能源职业技术学院 sxny
  山西中医学院 sxtcm
  山西大学 sxu
  山西财经大学 sxufe
  山西轻工职业技术学院 sxzzy
  沈阳农业大学 syau
  沈阳医学院 symc
  沈阳大学 syu
  沈阳化工大学 syuct
  苏州农业职业技术学院 szai
  深圳信息职业技术学院 sziit
  苏州信息职业技术学院 szitu
  苏州经贸职业技术学院 szjm
  苏州建设交通高职校 szjsjt
  深圳职业技术学院 szpt
  沙洲职业工学院 szzyg
  天津商务职业学院 tcc1955
  苏州大学应用技术学院 tecsuda
  湖北三峡职业技术学院 tgc
  通化师范学院 thnu
  北京科技大学天津学院 tj.ustb
  天津商业大学 tjcu
  天津国土资源和房屋职业学院 tjgfxy.
  天津师范大学 tjnu
  天津石油职业技术学院 tjsyxy
  天津体育学院 tjus
  天津中医药大学 tjutcm
  天津医学高等专科学校 tjyzh
  铜陵职业技术学院 tlpt
  同济大学 tongji
  唐山学院 tsc
  泰山医学院 tsmc
  泰山学院 tsu
  太原师范学院 tynu
  太原理工大学 tyut
  泰州职业技术学院 tzpc
  台州科技职业学院 tzvcst
  台州职业技术学院 tzvtc
  电子科技大学 uestc
  国际关系学院 uir
  济南大学 ujn
  江苏大学 ujs
  南华大学 usc
  上海理工大学 usst
  北京科技大学 ustb
  苏州科技大学 usts
  武汉商学院 wbu
  潍坊学院 wfu
  武汉音乐学院 whcm
  芜湖职业技术学院 whit
  武汉交通职业学院 whjzy
  武汉轻工大学 whpu
  武汉大学 whu
  武汉理工大学 whut
  武汉软件工程职业学院 whvcse
  武汉体育学院 wipe
  温州医科大学 wmu
  渭南职业技术学院 wnzy
  武昌工学院 wpuic
  武汉船舶职业技术学院 wspc
  武汉职业技术学院 wtc
  武汉纺织大学 wtu
  武昌理工学院 wut
  无锡城市职业技术学院 wxcu
  无锡职业技术学院 wxit
  无锡机电高等职业技术学校 wxjd
  无锡开放大学 wxtvu
  温州技师学院 wzjsxy
  温州大学 wzu
  温州科技职业技术学院 wzvcst
  温州职业技术学院 wzvtc
  西安音乐学院 xacom
  西安美术学院 xafa
  西安翻译学院 xafy
  西安石油大学 xapi
  西安工业大学 xatu
  西安理工大学 xaut
  西昌学院 xcc
  许昌学院 xcu
  西安财经学院行知学院 xcxz
  西安技师学院 xdpxedu
  西安电子科技大学 xidian
  厦门工学院 xit
  西安邮电大学 xiyou
  新疆农业大学 xjau
  新疆师范大学 xjnu
  西交利物浦大学 xjtlu
  西安交通大学 xjtu
  厦门城市职业学院 xmcu
  厦门东海职业技术学院 xmdh
  厦门医学院 xmmc
  厦门大学 xmu
  厦门理工学院 xmut
  邢台职业技术学院 xpc
  西安工程大学 xpu
  西安科技大学 xust
  新乡医学院 xxmu
  新乡学院 xxu
  新乡职业技术学院 xxvtc
  咸阳师范学院 xysfxy
  徐州工业职业技术学院 xzcit
  徐州财经高等职业技术学校 xzcx
  徐州工程学院 xzit
  徐州医科大学 xzmc
  江苏师范大学 xznu
  忻州师范学院 xztc
  徐州幼儿师范高等专科学校 xzyz
  延安大学 yau
  延边大学 ybu
  盐城生物工程高等职业技术学校 ycswgc
  盐城师范学院 yctc
  南宁学院 yjdx
  营口职业技术学院 ykdx
  玉林师范学院 ylu
  云南国土资源职业学院 yngtxy
  云南大学 ynu
  云南财经大学 ynufe
  燕山大学 ysu
  烟台大学 ytu
  榆林学院 yulinu
  义乌工商职业技术学院 ywu
  扬州高等职业技术学校 yzgzx
  长江师范学院 yznu
  扬州市职业大学 yzpc
  淄博师范高等专科学校 zbnc
  重庆工程学院 zdsoft
  浙江金融职业学院 zfc
  中国农业大学 zgnd
  山东省城市服务技师学院 zgprxf
  北京理工大学珠海学院 zhbit
  郑州工程技术学院 zhzhu
  浙江农林大学 zifc
  浙江机电职业技术学院 zime
  郑州科技学院 zit
  浙江工商职业技术学院 zjbti
  浙江工业大学之江学院 zjc
  浙江工商大学杭州商学院 zjhzcc
  浙江工贸职业技术学院 zjitc
  浙江师范大学 zjnu
  浙江医药高等专科学校 zjpc
  浙江树人学院 zjsru
  浙江经济职业技术学院 zjtie
  浙江特殊教育学院 zjtjxy
  浙江大学 zju
  浙江工业大学 zjut
  浙江商业职业技术学院 zjvcc
  浙江水利水电学院 zjweu
  浙江育英职业技术学院 zjyyc
  南通理工学院 zlvc
  中南民族大学 znmd
  浙江理工大学 zstu
  山东英才学院 zsw
  浙江大学城市学院 zucc
  中南财经政法大学 zuel
  浙江财经学院 zufe
  浙江科技学院 zust
  浙江越秀外国语学院 zyufl
  郑州铁路职业技术学院 zzrvtc
  郑州师范学院 zztc
  中原工学院 zzti
  郑州旅游职业学院 zztrc
  郑州大学 zzu
  郑州轻工业学院 zzuli
  郑州职业技术学院 zzyedu
  </pre>

  </details>

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

  # 学校的英文简称（推荐，部分学校支持，请查阅[支持英文简称的学校列表](https://github.com/beetcb/cea#abbrlist)自行判断）或中文全称（备用选项，所有学校都支持）
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

`@beetcb/cea` - Licensed under under [MIT](https://github.com/beetcb/cea/blob/master/LICENSE)

`campusphere-elegant-auth` 用于学习和研究 NodeJS，请勿商用或违法使用。

> 作者: [`beetcb`](https://www.beetcb.com), 邮箱: `i@beetcb.com`
