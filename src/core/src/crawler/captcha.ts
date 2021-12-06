import fs from 'node:fs'
import { stdin, stdout } from 'node:process'
import readline from 'node:readline'

import fetch from 'node-fetch'
import terminalImage from 'terminal-image'
import { createWorker } from 'tesseract.js'

import type { UserConfOpts } from '../types/conf'
import type FetchWithCookie from '../utils/fetch-helper.js'

const tessdataPath = '/tmp/eng.traineddata.gz'

async function downloadTessdata() {
  process.env.TESSDATA_PREFIX = '/tmp'
  // check folder exists
  if (!fs.existsSync('/tmp')) {
    fs.mkdirSync('/tmp')
  } else {
    // check file exists
    if (fs.existsSync(tessdataPath)) {
      return
    }
  }
  console.log(
    await download(
      'https://beetcb.gitee.io/filetransfer/tmp/eng.traineddata.gz',
      tessdataPath,
    ),
  )
}

async function download(url: string, filename: string): Promise<string> {
  const stream = fs.createWriteStream(filename)
  const res = await fetch(url)
  const result = await new Promise((resolve, reject) => {
    res.body?.pipe(stream)
    res.body?.on('error', (e) => reject(e))
    stream.on('close', () => resolve(`Downloaded tess data as ${filename}`))
  }).catch((err) => console.error(err))
  return result as string
}

async function ocr(captchaUrl: string) {
  await downloadTessdata()
  const worker = createWorker({
    langPath: '/tmp',
    cachePath: '/tmp',
  })
  await worker.load()
  await worker.loadLanguage('eng')
  await worker.initialize('eng')
  await worker.setParameters({
    tessedit_char_whitelist:
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  })
  const {
    data: { text },
  } = await worker.recognize(captchaUrl)
  await worker.terminate()
  return text
}

export async function captchaHandler(
  url: string,
  fetch: FetchWithCookie,
  mode: UserConfOpts['captcha'],
): Promise<string> {
  if (mode === 'MANUAL') {
    const body = await fetch.get(url).then((res) => res.buffer())
    // Save image to localhost, backup plan
    fs.writeFile('/tmp/captcha.jpg', body, function(err) {
      if (err) console.error(err)
    })

    // Manually input captcha by user
    console.log(await terminalImage.buffer(body))
    console.log(`手动输入验证码模式,验证码图片保存至 /tmp/captcha.jpg`)
    const rl = readline.createInterface({ input: stdin, output: stdout })
    return await new Promise((resolve) => {
      rl.question('请输入验证码: ', (an) => {
        resolve(an)
        rl.close()
      })
    })
  } else {
    return (await ocr(url)).replace(/\s/g, '')
  }
}
