import libre from 'libreoffice-convert'
// import fs from 'fs'
import { fromBuffer } from 'pdf2pic'

const options = {
  density: 100,
  saveFilename: 'default',
  savePath: '/tmp/',
  format: 'png',
  height: 842,
  width: 595
}

async function processPreview (buffer, fileName) {
  const pdfFileName = `${fileName}`.replaceAll('/', '')
  if (!pdfFileName.endsWith('.pdf')) {
    buffer = await convertDocToPdf(options.savePath, buffer, pdfFileName)
  }
  options.saveFilename = pdfFileName.substr(0, pdfFileName.indexOf('.'))
  const storeAsImage = fromBuffer(buffer, options)
  const pageToConvertAsImage = 1

  return storeAsImage(pageToConvertAsImage).then((resolve) => {
    return resolve
  })
}

async function convertDocToPdf (savePath, buffer, outputFileName) {
  try {
    return new Promise((resolve, reject) => {
      libre.convert(buffer, '.pdf', undefined, (err, done) => {
        if (err) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('Doc transformation failed' + err)
        } else {
          // const outputFile = outputFileName.indexOf('.docx') > 0 ? outputFileName.replaceAll('.docx', '.pdf') : outputFileName.replaceAll('.doc', '.pdf')
          // fs.writeFileSync(savePath + outputFile, done)
          resolve(done)
        }
      })
    })
  } catch (err) {
    console.log('Error in input reading', err)
  }
}
export default processPreview
