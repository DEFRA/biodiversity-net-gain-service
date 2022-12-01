import fs from 'fs'
import path from 'path'
import BngExtractionService from '../src/BngMetricExtractionService.js'

describe('BNG data extrator service test', () => {
  let readableStream, bngMetricDataExtractionService
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages', 'bng-metric-service', '__tests__/metricfiles/metric-file.xlsm')))
    bngMetricDataExtractionService = new BngExtractionService()
  })

  it('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    const response = await bngMetricDataExtractionService.extractMetricContent(readableStream)
    expect(Object.keys(response).length).toBe(2)
  })
})
