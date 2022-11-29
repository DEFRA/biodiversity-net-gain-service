import fs from 'fs'
import path from 'path'
import BngExtractionService from '../src/BngMetricExtractionService.js'

describe('BNG data extrator service test', () => {
  let readableStream
  let bNGMetricDataExtractorService
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages', 'bngdataextractor', '__tests__/metricfiles/metric-file.xlsm')))
    bNGMetricDataExtractorService = new BngExtractionService()
  })

  afterEach(() => {
    readableStream = undefined
    bNGMetricDataExtractorService = undefined
  })

  it('must extract all the excel sheets in a biodiversity metric file', async () => {
    const response = await bNGMetricDataExtractorService.extractMetricContent(readableStream)
    expect(Object.keys(response).length).toBe(2)
  })
})
