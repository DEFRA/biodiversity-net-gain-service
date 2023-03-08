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
        startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
        // Metric 4.0
        d1OffSiteHabitatBaselinev4: bngMetricService.extractionConfiguration['v4.0'].d1OffSiteHabitatBaseline,
        d2OffSiteHabitatCreationv4: bngMetricService.extractionConfiguration['v4.0'].d2OffSiteHabitatCreation,
        d3OffSiteHabitatEnhancementv4: bngMetricService.extractionConfiguration['v4.0'].d3OffSiteHabitatEnhancement,
        e1OffSiteHedgeBaselinev4: bngMetricService.extractionConfiguration['v4.0'].e1OffSiteHedgeBaseline,
        e2OffSiteHedgeCreationv4: bngMetricService.extractionConfiguration['v4.0'].e2OffSiteHedgeCreation,
        e3OffSiteHedgeEnhancementv4: bngMetricService.extractionConfiguration['v4.0'].e3OffSiteHedgeEnhancement,
        f1OffSiteWaterCBaselinev4: bngMetricService.extractionConfiguration['v4.0'].f1OffSiteWaterCBaseline,
        f2OffSiteWaterCCreationv4: bngMetricService.extractionConfiguration['v4.0'].f2OffSiteWaterCCreation,
        f3OffSiteWaterCEnhancementv4: bngMetricService.extractionConfiguration['v4.0'].f3OffSiteWaterCEnhancement
      },
      validationConfiguration: {
        isVersion4: bngMetricService.validationConfiguration.isVersion4,
        isOffsiteDataPresent: bngMetricService.validationConfiguration.isOffsiteDataPresent,
        areOffsiteTotalsCorrect: bngMetricService.validationConfiguration.areOffsiteTotalsCorrect
      }
    }
    const response = await extractMetricContent(readableStream, options)

    expect(Object.keys(response).length).toBe(11)
    expect(response.validation).toBeTruthy()
  })
})
