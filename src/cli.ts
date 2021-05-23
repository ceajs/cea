#!/usr/bin/env node
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
      break
    }
    case 'school': {
      break
    }
    case 'rm': {
      break
    }
    case 'sign': {
      break
    }
    case 'load': {
    }
  }
})()
