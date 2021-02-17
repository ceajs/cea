pipeline {
  agent any
  triggers{ cron('0 5,11,16 * * *') }
  stages {
    stage('拉取代码库') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: env.GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: env.GIT_REPO_URL,
            credentialsId: env.CREDENTIALS_ID
          ]]])
        }
      }
    stage('签到') {
      steps {
          sh 'npm ci'
          sh 'node ./init.js'
          sh 'date'
        }
      }
    }
  }
