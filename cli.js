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
      if (type === 1) userUlti.createUser()
      if (type === 2) userUlti.deleteUser()
      break
    }
    case '-s':
    case '--school': {
      new School(conf).init()
      break
    }
    case 'rm':
    case '--remove': {
      if (argv2 === 'all') conf.clear()
      conf.delete(argv2)
      break
    }
    case 'sign': {
      require('./TEST/dcampus')
      break
    }
    case 'load': {
      await conf.load()
      break
    }
  }
})()

module.exports = { User, School }
