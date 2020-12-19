const { createWorker } = require('tesseract.js')
const fs = require('fs')
const fetch = require('node-fetch')

module.exports = async function ocr(captchaUrl) {
  const worker = createWorker()
  const filename = 'preview.png'
  const pic = await fetch(captchaUrl)
  await pic.body.pipe(fs.createWriteStream(filename)).on('finish', () => {})
  await worker.load()
  await worker.loadLanguage('eng')
  await worker.initialize('eng')
  const {
    data: { text },
  } = await worker.recognize(filename)
  await worker.terminate()
  return text.replace(/[^\d\w]/g, '').slice(0, 4)
}
