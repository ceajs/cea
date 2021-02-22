#!/usr/bin/env node
const { User, School, conf } = require('./api')

;(async () => {
  const argv = process.argv[2] || ''
  const argv2 = process.argv[3]

  switch (argv) {
    case '-u':
    case '--user': {
      const userUlti = new User(conf)
      await userUlti.load()
      const type = userUlti.selectType
      if (type === 1) await userUlti.createUser()
      if (type === 2) await userUlti.deleteUser()
      break
    }
    case '-s':
    case '--school': {
      await new School(conf).init()
      break
    }
    case 'rm':
    case '--remove': {
      if (argv2 === 'all') conf.clear()
      conf.del(argv2)
      break
    }
    case 'sign': {
      require('../TEST/dcampus')
      break
    }
    case 'load': {
      // If load and -u mixed in, use load first
      conf.clear()
      await conf.init()
    }
  }

  conf.close()
})()

module.exports = { User, School }
