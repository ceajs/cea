#!/usr/bin/env node
import { loadConfFromToml, promptToGetConf, getSchoolInfos } from './conf'
import { sstore } from './index'
;(async () => {
  const argv = process.argv[2] || ''
  const argv2 = process.argv[3]

  switch (argv) {
    case '-h':
    case '--help': {
      console.log(`
Usage: cea <command>
All Commands: 
      user      create|delete user
      school    config your school info
      sign      campusphere check in
      load      load config info from toml file
      rm        remove stored config feilds
`)
      break
    }
    case 'user': {
      const users = await promptToGetConf(sstore.get('users'))
      if (users) {
        const schoolInfos = getSchoolInfos(users)
        if (schoolInfos) {
          sstore.set('schools', schoolInfos)
        }
        sstore.set('users', users)
      }
      break
    }
    case 'rm': {
      sstore.del(argv2)
      if (argv2 === 'all') {
        sstore.clear()
      }
      break
    }
    case 'sign': {
      // get cookie
      // load plugin
      // close cea
      break
    }
    case 'load': {
      const users = loadConfFromToml()
      if (users) {
        const schoolInfos = await getSchoolInfos(users)
        if (schoolInfos) {
          sstore.set('schools', schoolInfos)
        }
        sstore.set('users', users)
      }
    }
  }

  sstore.close()
})()
