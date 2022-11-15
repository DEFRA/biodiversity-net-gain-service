import Main from './src/main.js'
import dotenv from 'dotenv'
dotenv.config()
const blobName = process.env.AZURE_BLOB_NAME
const extractData = new Main(blobName)

try {
  const metricData = await extractData.getBlobData()
  console.info('Extracted metric data')
  console.log('-----------------------')
  console.log(metricData.startPage)
} catch (err) {
  console.error('Err: ', err)
}
