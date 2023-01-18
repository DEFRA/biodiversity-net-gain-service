import fs from 'fs'
import path from 'path'
import extractMetricContent from '../src/helpers/bng-metric-extraction-service.js'
import bngMetricService from '../src/service.js'

describe('BNG data extractor service test', () => {
  let readableStream
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'metric-file.xlsm')))
  })

  it('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    const options = {
      extractionConfiguration: {
        startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
        siteHabitatBaseline: bngMetricService.extractionConfiguration.habitatBaselineExtractionConfig
      }
    }
    const response = await extractMetricContent(readableStream, options)
    expect(Object.keys(response).length).toBe(2)
  })
})
