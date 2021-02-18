const { createWorker } = require('tesseract.js')

module.exports = async function ocr(captchaUrl) {
  const worker = createWorker({
    langPath: 'crawler',
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
