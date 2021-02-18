const { createWorker } = require('tesseract.js')
const fetch = require('node-fetch')
const fs = require('fs')
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
  const result = await download(
    'https://beetcb.gitee.io/filetransfer/tmp/eng.traineddata.gz',
    tessdataPath
  )
  console.log(result)
}

async function download(url, filename) {
  const stream = fs.createWriteStream(filename)
  const res = await fetch(url)
  const result = await new Promise((resolve, reject) => {
    res.body.pipe(stream)
    res.body.on('error', reject)
    stream.on('close', () => resolve(`Downloaded tess data as ${filename}`))
  })
  return result
}

async function ocr(captchaUrl) {
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

module.exports = ocr
