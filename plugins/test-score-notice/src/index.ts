import { UserConfOpts, UsersConf } from 'cea-core'
import { handleCookie, sstore } from 'cea-core'

import fetch from 'node-fetch'
;(async () => {
  await handleCookie({
    // @ts-ignore
    preCookieURLArray: [
      'https://jwglxt.whpu.edu.cn/rump_frontend/login/?next=https%3A%2F%2Fjwglxt.whpu.edu.cn%2Fsso%2Fjziotlogin',
      'https://sec.whpu.edu.cn/rump_frontend/login/?next=https://jwglxt.whpu.edu.cn/sso/jziotlogin',
    ],
    authURL:
      'https://cas.whpu.edu.cn/authserver/login?service=https%3A%2F%2Fsec.whpu.edu.cn%2Frump_frontend%2FloginFromCas%2F',
  })
  const users: UsersConf = sstore.get('users')
  users.forEach((u: UserConfOpts) => {
    const storeCookiePath = `cookie.${u.alias}`
    const cookie = sstore.get(storeCookiePath)

    fetch(
      `https://jwglxt.whpu.edu.cn/cjcx/cjcx_cxDgXscj.html?doType=query&su=${u.username}`,
      {
        headers: {
          cookie: cookie['jwglxt.whpu.edu.cn'],
        },
      },
    ).then((d) => console.log(Object.fromEntries(d.headers)))
  })
})()
