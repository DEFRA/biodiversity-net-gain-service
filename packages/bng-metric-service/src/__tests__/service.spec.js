import fs from 'fs'
import extractMetricContent from '../helpers/bng-metric-extraction-service.js'
import bngMetricService from '../service.js'

describe('BNG data extractor service test', () => {
  let readableStream
  beforeEach(() => {
    readableStream = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0.xlsm')
  })

  it('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    const options = {
      extractionConfiguration: {
        start: bngMetricService.extractionConfiguration.startExtractionConfig,
        ...bngMetricService.extractionConfiguration['v4.1']
      },
      validationConfiguration: bngMetricService.validationConfiguration
    }
    const response = await extractMetricContent(readableStream, options)

    expect(Object.keys(response).length).toBe(11)
    expect(response.validation).toBeTruthy()
  })
})
