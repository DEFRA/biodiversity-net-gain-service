import fs from 'fs'
import BngMetricSingleDataExtractor from '../BngMetricSingleDataExtractor.js'
import bngMetricService from '../../../service.js'

describe('BNG data extractor test', () => {
  let readableStreamv4, readableStreamv31, bngMetricDataExtractor
  beforeEach(() => {
    readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0.2.xlsm')
    readableStreamv31 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-3.1.xlsm')
    bngMetricDataExtractor = new BngMetricSingleDataExtractor()
  })

  it('should extract metric v4', async () => {
    const options = {
      extractionConfiguration: {
        startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
        d1OffSiteHabitatBaselinev31: bngMetricService.extractionConfiguration['v3.1'].d1OffSiteHabitatBaseline,
        d2OffSiteHabitatCreationv31: bngMetricService.extractionConfiguration['v3.1'].d2OffSiteHabitatCreation,
        d3OffSiteHabitatEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].d3OffSiteHabitatEnhancement,
        e1OffSiteHedgeBaselinev31: bngMetricService.extractionConfiguration['v3.1'].e1OffSiteHedgeBaseline,
        e2OffSiteHedgeCreationv31: bngMetricService.extractionConfiguration['v3.1'].e2OffSiteHedgeCreation,
        e3OffSiteHedgeEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].e3OffSiteHedgeEnhancement,
        f1OffSiteRiverBaselinev31: bngMetricService.extractionConfiguration['v3.1'].f1OffSiteRiverBaseline,
        f2OffSiteRiverCreationv31: bngMetricService.extractionConfiguration['v3.1'].f2OffSiteRiverCreation,
        f3OffSiteRiverEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].f3OffSiteRiverEnhancement,
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
      }
    }
    const response = await bngMetricDataExtractor.extractContent(readableStreamv4, options.extractionConfiguration)

    expect(response.d1OffSiteHabitatBaselinev31).toBeNull()
    expect(response.d2OffSiteHabitatCreationv31).toBeNull()
    expect(response.d3OffSiteHabitatEnhancementv31).toBeNull()
    expect(response.e1OffSiteHedgeBaselinev31).toBeNull()
    expect(response.e2OffSiteHedgeCreationv31).toBeNull()
    expect(response.e3OffSiteHedgeEnhancementv31).toBeNull()
    expect(response.f1OffSiteRiverBaselinev31).toBeNull()
    expect(response.f2OffSiteRiverCreationv31).toBeNull()
    expect(response.f3OffSiteRiverEnhancementv31).toBeNull()

    expect(response.d1OffSiteHabitatBaselinev4.length).toEqual(2)
    expect(Object.keys(response.d1OffSiteHabitatBaselinev4[0]).length).toEqual(5)
    expect(response.d2OffSiteHabitatCreationv4.length).toEqual(2)
    expect(Object.keys(response.d2OffSiteHabitatCreationv4[0]).length).toEqual(7)
    expect(response.d3OffSiteHabitatEnhancementv4.length).toEqual(2)
    expect(Object.keys(response.d3OffSiteHabitatEnhancementv4[0]).length).toEqual(7)

    expect(response.e1OffSiteHedgeBaselinev4.length).toEqual(3)
    expect(Object.keys(response.e1OffSiteHedgeBaselinev4[0]).length).toEqual(4)
    expect(response.e2OffSiteHedgeCreationv4.length).toEqual(2)
    expect(Object.keys(response.e2OffSiteHedgeCreationv4[0]).length).toEqual(6)
    expect(response.e3OffSiteHedgeEnhancementv4.length).toEqual(3)
    expect(Object.keys(response.e3OffSiteHedgeEnhancementv4[0]).length).toEqual(7)

    expect(response.f1OffSiteWaterCBaselinev4.length).toEqual(3)
    expect(Object.keys(response.f1OffSiteWaterCBaselinev4[0]).length).toEqual(4)
    expect(response.f2OffSiteWaterCCreationv4.length).toEqual(2)
    expect(Object.keys(response.f2OffSiteWaterCCreationv4[0]).length).toEqual(6)
    expect(response.f3OffSiteWaterCEnhancementv4.length).toEqual(3)
    expect(Object.keys(response.f3OffSiteWaterCEnhancementv4[0]).length).toEqual(7)
  })

  it('should extract metric v3.1', async () => {
    const options = {
      extractionConfiguration: {
        startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
        d1OffSiteHabitatBaselinev31: bngMetricService.extractionConfiguration['v3.1'].d1OffSiteHabitatBaseline,
        d2OffSiteHabitatCreationv31: bngMetricService.extractionConfiguration['v3.1'].d2OffSiteHabitatCreation,
        d3OffSiteHabitatEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].d3OffSiteHabitatEnhancement,
        e1OffSiteHedgeBaselinev31: bngMetricService.extractionConfiguration['v3.1'].e1OffSiteHedgeBaseline,
        e2OffSiteHedgeCreationv31: bngMetricService.extractionConfiguration['v3.1'].e2OffSiteHedgeCreation,
        e3OffSiteHedgeEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].e3OffSiteHedgeEnhancement,
        f1OffSiteRiverBaselinev31: bngMetricService.extractionConfiguration['v3.1'].f1OffSiteRiverBaseline,
        f2OffSiteRiverCreationv31: bngMetricService.extractionConfiguration['v3.1'].f2OffSiteRiverCreation,
        f3OffSiteRiverEnhancementv31: bngMetricService.extractionConfiguration['v3.1'].f3OffSiteRiverEnhancement,
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
      }
    }
    const response = await bngMetricDataExtractor.extractContent(readableStreamv31, options.extractionConfiguration)
    expect(response.d1OffSiteHabitatBaselinev4).toBeNull()
    expect(response.d2OffSiteHabitatCreationv4).toBeNull()
    expect(response.d3OffSiteHabitatEnhancementv4).toBeNull()
    expect(response.e1OffSiteHedgeBaselinev4).toBeNull()
    expect(response.e2OffSiteHedgeCreationv4).toBeNull()
    expect(response.e3OffSiteHedgeEnhancementv4).toBeNull()
    expect(response.f1OffSiteWaterCBaselinev4).toBeNull()
    expect(response.f2OffSiteWaterCCreationv4).toBeNull()
    expect(response.f3OffSiteWaterCEnhancementv4).toBeNull()
    expect(response).toBeTruthy()

    expect(response.d1OffSiteHabitatBaselinev31.length).toEqual(2)
    expect(Object.keys(response.d1OffSiteHabitatBaselinev31[0]).length).toEqual(5)
    expect(response.d2OffSiteHabitatCreationv31.length).toEqual(2)
    expect(Object.keys(response.d2OffSiteHabitatCreationv31[0]).length).toEqual(7)
    expect(response.d3OffSiteHabitatEnhancementv31.length).toEqual(2)
    expect(Object.keys(response.d3OffSiteHabitatEnhancementv31[0]).length).toEqual(7)

    expect(response.e1OffSiteHedgeBaselinev31.length).toEqual(3)
    expect(Object.keys(response.e1OffSiteHedgeBaselinev31[0]).length).toEqual(4)
    expect(response.e2OffSiteHedgeCreationv31.length).toEqual(1)
    expect(Object.keys(response.e2OffSiteHedgeCreationv31[0]).length).toEqual(2)
    expect(response.e3OffSiteHedgeEnhancementv31.length).toEqual(2)
    expect(Object.keys(response.e3OffSiteHedgeEnhancementv31[0]).length).toEqual(7)

    expect(response.f1OffSiteRiverBaselinev31.length).toEqual(3)
    expect(Object.keys(response.f1OffSiteRiverBaselinev31[0]).length).toEqual(4)
    expect(response.f2OffSiteRiverCreationv31.length).toEqual(1)
    expect(Object.keys(response.f2OffSiteRiverCreationv31[0]).length).toEqual(2)
    expect(response.f3OffSiteRiverEnhancementv31.length).toEqual(2)
    expect(Object.keys(response.f3OffSiteRiverEnhancementv31[0]).length).toEqual(7)
  })
})
