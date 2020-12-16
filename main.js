const conf = require('./init')

const login = require('./crawler/casLogIn')
const log = require('./interface/colorLog')

const school = conf.get('school')
const users = conf.get('users')

if (!users.length) log.error('未找到用户,请运行 ./init.js -u 配置')
users.forEach(async i => {
  /**
   * Keys of this cookie Object:
   * YOU CAN USE THIS COOKIE FOR EVERYTHING
   * @compusphere something about cp daliy's app
   * @swms continuing log into your school's swms [stu work magagement system]
   */
  const cookie = await login(school, i)
})
