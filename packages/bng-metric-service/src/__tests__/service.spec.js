import fs from 'fs'
import path from 'path'
import extractMetricContent from '../helpers/bng-metric-extraction-service.js'

const currentPath = process.cwd()

describe('BNG data extractor service test', () => {
  it.only('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    const readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/src/__mock-data__/metric-file', 'metric-file.xlsm')))
    const response = await performExtractMetricContent(readableStream)
    expect(response.startPage).toBeDefined()
    expect(Object.keys(response).length).toBe(1)
  })
  
  it('must return null if empty start worksheet uploaded', async () => {
    const readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/src/__mock-data__/metric-file', 'metric-4.0.2.xlsm')))
    await expect(performExtractMetricContent(readableStream)).rejects.toThrow("")
  })
  
  it('must throw error if other file uploaded', async () => {
    const readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/src/__mock-data__/metric-file', 'sample.txt')))
    await expect(performExtractMetricContent(readableStream)).rejects.toThrow("")
  })
})

const performExtractMetricContent = async (inputStream) => {
  return await extractMetricContent(inputStream)
}
