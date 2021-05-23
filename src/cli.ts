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
      const config = await promptToGetConf()
      if (config) {
        const schoolInfos = getSchoolInfos(config)
        if (schoolInfos) {
          sstore.set('schools', schoolInfos)
        }
        sstore.set('users', config)
      }
      break
    }
    case 'rm': {
      sstore.delete(argv2)
      break
    }
    case 'sign': {
      // get cookie
      // load plugin
      // close cea
      break
    }
    case 'load': {
      const config = loadConfFromToml()
      if (config) {
        const schoolInfos = getSchoolInfos(config)
        if (schoolInfos) {
          sstore.set('schools', schoolInfos)
        }
        sstore.set('users', config)
        sstore.set('config', config)
      }
    }
  }

  sstore.close()
})()
