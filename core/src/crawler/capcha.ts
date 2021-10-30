import fs from 'fs'
import fetch from 'node-fetch'
import * as tesseract from 'tesseract.js'
const { createWorker } = tesseract

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

export default ocr
