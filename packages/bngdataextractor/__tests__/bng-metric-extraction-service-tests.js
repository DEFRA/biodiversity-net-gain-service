import fs from 'fs'
import path from 'path'
import BngExtractionService from '../src/bng-metric-extraction-service'

describe('BNG data extrator service test', () => {
  let readableStream
  let bNGMetricDataExtractorService

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(), '__tests__/metricfiles/biodiversity30.xlsm'))
    bNGMetricDataExtractorService = new BngExtractionService()
  })

  afterEach(() => {
    readableStream = undefined
    bNGMetricDataExtractorService = undefined
  })

  it('must extract all the excel sheets in a biodiversity metric file', async () => {
    const response = await bNGMetricDataExtractorService.extractMetricContent(readableStream)
    expect(Object.keys(response).length).toBe(8)
  })
})
