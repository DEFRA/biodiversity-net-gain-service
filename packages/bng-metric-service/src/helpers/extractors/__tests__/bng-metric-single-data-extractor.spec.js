import fs from 'fs'
import BngMetricSingleDataExtractor from '../bng-metric-single-data-extractor.js'
import bngMetricService from '../../../service.js'

describe('BNG data extractor test', () => {
  it('should extract a valid metric v4', async () => {
    const readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()

    const extractionConfiguration = {
      startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
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

    const validationConfiguration = {
      isVersion4: bngMetricService.validationConfiguration.isVersion4,
      isOffsiteDataPresent: bngMetricService.validationConfiguration.isOffsiteDataPresent,
      areOffsiteTotalsCorrect: bngMetricService.validationConfiguration.areOffsiteTotalsCorrect
    }

    const response = await bngMetricDataExtractor.extractContent(readableStreamv4, { extractionConfiguration, validationConfiguration })

    expect(response.d1OffSiteHabitatBaselinev4.length).toEqual(5)
    expect(Object.keys(response.d1OffSiteHabitatBaselinev4[0]).length).toEqual(5)
    expect(response.d1OffSiteHabitatBaselinev4[0]['Broad habitat']).toEqual('Cropland')
    expect(response.d1OffSiteHabitatBaselinev4[0]['Habitat type']).toEqual('Cereal crops')
    expect((response.d1OffSiteHabitatBaselinev4[0]['Area (hectares)']).toFixed(2)).toEqual('1.00')
    expect(response.d1OffSiteHabitatBaselinev4[0].Condition).toEqual('Condition Assessment N/A')
    expect((response.d1OffSiteHabitatBaselinev4[0]['Total habitat units']).toFixed(2)).toEqual('2.00')

    expect(response.d2OffSiteHabitatCreationv4.length).toEqual(3)
    expect(Object.keys(response.d2OffSiteHabitatCreationv4[0]).length).toEqual(7)
    expect(response.d2OffSiteHabitatCreationv4[0]['Broad habitat']).toEqual('Grassland')
    expect(response.d2OffSiteHabitatCreationv4[0]['Proposed habitat']).toEqual('Other neutral grassland')
    expect((response.d2OffSiteHabitatCreationv4[0]['Area (hectares)']).toFixed(2)).toEqual('0.90')
    expect(response.d2OffSiteHabitatCreationv4[0].Condition).toEqual('Fairly Good')
    expect(response.d2OffSiteHabitatCreationv4[0]['Habitat created in advance (years)']).toEqual(0)
    expect(response.d2OffSiteHabitatCreationv4[0]['Delay in starting habitat creation (years)']).toEqual(0)
    expect((response.d2OffSiteHabitatCreationv4[0]['Habitat units delivered']).toFixed(2)).toEqual('7.01')

    expect(response.d3OffSiteHabitatEnhancementv4.length).toEqual(4)
    expect(Object.keys(response.d3OffSiteHabitatEnhancementv4[0]).length).toEqual(8)
    expect(response.d3OffSiteHabitatEnhancementv4[0]['Baseline habitat']).toEqual('Grassland - Modified grassland')
    expect(response.d3OffSiteHabitatEnhancementv4[0]['Proposed habitat']).toEqual('Lowland raised bog')
    expect(response.d3OffSiteHabitatEnhancementv4[0]['Proposed Broad Habitat']).toEqual('Wetland')
    expect((response.d3OffSiteHabitatEnhancementv4[0]['Area (hectares)']).toFixed(2)).toEqual('1.00')
    expect(response.d3OffSiteHabitatEnhancementv4[0].Condition).toEqual('Good')
    expect(response.d3OffSiteHabitatEnhancementv4[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.d3OffSiteHabitatEnhancementv4[0]['Delay in starting habitat enhancement (years)']).toEqual(0)
    expect((response.d3OffSiteHabitatEnhancementv4[0]['Habitat units delivered']).toFixed(2)).toEqual('7.03')

    expect(response.e1OffSiteHedgeBaselinev4.length).toEqual(3)
    expect(Object.keys(response.e1OffSiteHedgeBaselinev4[0]).length).toEqual(4)
    expect(response.e1OffSiteHedgeBaselinev4[0]['Hedgerow type']).toEqual('Native hedgerow - associated with bank or ditch')
    expect(response.e1OffSiteHedgeBaselinev4[0]['Length (km)']).toEqual(0.3)
    expect(response.e1OffSiteHedgeBaselinev4[0].Condition).toEqual('Poor')
    expect((response.e1OffSiteHedgeBaselinev4[0]['Total hedgerow units']).toFixed(2)).toEqual('1.20')

    expect(response.e2OffSiteHedgeCreationv4.length).toEqual(2)
    expect(Object.keys(response.e2OffSiteHedgeCreationv4[0]).length).toEqual(6)
    expect(response.e2OffSiteHedgeCreationv4[0]['Habitat type']).toEqual('Native hedgerow with trees')
    expect(response.e2OffSiteHedgeCreationv4[0]['Length (km)']).toEqual(0.3)
    expect(response.e2OffSiteHedgeCreationv4[0].Condition).toEqual('Good')
    expect(response.e2OffSiteHedgeCreationv4[0]['Habitat created in advance (years)']).toEqual(0)
    expect(response.e2OffSiteHedgeCreationv4[0]['Delay in starting habitat creation (years)']).toEqual(0)
    expect((response.e2OffSiteHedgeCreationv4[0]['Hedge units delivered']).toFixed(2)).toEqual('1.77')

    expect(response.e3OffSiteHedgeEnhancementv4.length).toEqual(2)
    expect(Object.keys(response.e3OffSiteHedgeEnhancementv4[0]).length).toEqual(7)
    expect(response.e3OffSiteHedgeEnhancementv4[0]['Baseline habitat']).toEqual('Native hedgerow - associated with bank or ditch')
    expect(response.e3OffSiteHedgeEnhancementv4[0]['Proposed habitat']).toEqual('Native hedgerow - associated with bank or ditch')
    expect(response.e3OffSiteHedgeEnhancementv4[0]['Length (km)']).toEqual(0.3)
    expect(response.e3OffSiteHedgeEnhancementv4[0].Condition).toEqual('Moderate')
    expect(response.e3OffSiteHedgeEnhancementv4[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.e3OffSiteHedgeEnhancementv4[0]['Delay in starting habitat enhancement (years)']).toEqual(0)
    expect((response.e3OffSiteHedgeEnhancementv4[0]['Hedge units delivered']).toFixed(2)).toEqual('2.28')

    expect(response.f1OffSiteWaterCBaselinev4.length).toEqual(3)
    expect(Object.keys(response.f1OffSiteWaterCBaselinev4[0]).length).toEqual(4)
    expect(response.f1OffSiteWaterCBaselinev4[0]['Watercourse type']).toEqual('Ditches')
    expect(response.f1OffSiteWaterCBaselinev4[0]['Length (km)']).toEqual(0.3)
    expect(response.f1OffSiteWaterCBaselinev4[0].Condition).toEqual('Poor')
    expect((response.f1OffSiteWaterCBaselinev4[0]['Total watercourse units']).toFixed(2)).toEqual('1.20')

    expect(response.f2OffSiteWaterCCreationv4.length).toEqual(2)
    expect(Object.keys(response.f2OffSiteWaterCCreationv4[0]).length).toEqual(6)
    expect(response.f2OffSiteWaterCCreationv4[0]['Watercourse type']).toEqual('Ditches')
    expect(response.f2OffSiteWaterCCreationv4[0]['Length (km)']).toEqual(0.3)
    expect(response.f2OffSiteWaterCCreationv4[0].Condition).toEqual('Fairly Good')
    expect(response.f2OffSiteWaterCCreationv4[0]['Habitat created in advance (years)']).toEqual(0)
    expect(response.f2OffSiteWaterCCreationv4[0]['Delay in starting habitat creation (years)']).toEqual(0)
    expect((response.f2OffSiteWaterCCreationv4[0]['Watercourse units delivered']).toFixed(2)).toEqual('2.59')

    expect(response.f3OffSiteWaterCEnhancementv4.length).toEqual(2)
    expect(Object.keys(response.f3OffSiteWaterCEnhancementv4[0]).length).toEqual(7)
    expect(response.f3OffSiteWaterCEnhancementv4[0]['Baseline habitat']).toEqual('Ditches')
    expect(response.f3OffSiteWaterCEnhancementv4[0]['Proposed habitat']).toEqual('Ditches')
    expect(response.f3OffSiteWaterCEnhancementv4[0]['Length (km)']).toEqual(0.3)
    expect(response.f3OffSiteWaterCEnhancementv4[0].Condition).toEqual('Good')
    expect(response.f3OffSiteWaterCEnhancementv4[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.f3OffSiteWaterCEnhancementv4[0]['Delay in starting habitat enhancement (years)']).toEqual(0)
    expect((response.f3OffSiteWaterCEnhancementv4[0]['Watercourse units delivered']).toFixed(2)).toEqual('2.41')

    expect(response.validation.isVersion4).toBe(true)
    expect(response.validation.isOffsiteDataPresent).toBe(true)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(true)
  })

  it('Should fail validation if not v4 metric', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-3.1.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()

    const extractionConfiguration = {
      startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
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

    const validationConfiguration = {
      isVersion4: bngMetricService.validationConfiguration.isVersion4,
      isOffsiteDataPresent: bngMetricService.validationConfiguration.isOffsiteDataPresent,
      areOffsiteTotalsCorrect: bngMetricService.validationConfiguration.areOffsiteTotalsCorrect
    }

    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, { extractionConfiguration, validationConfiguration })

    expect(response.validation.isVersion4).toBe(false)
    expect(response.validation.isOffsiteDataPresent).toBe(true)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(false)
  })
  it('Should fail validation if v4 metric without data', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0-empty.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()

    const extractionConfiguration = {
      startPage: bngMetricService.extractionConfiguration.startExtractionConfig,
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

    const validationConfiguration = {
      isVersion4: bngMetricService.validationConfiguration.isVersion4,
      isOffsiteDataPresent: bngMetricService.validationConfiguration.isOffsiteDataPresent,
      areOffsiteTotalsCorrect: bngMetricService.validationConfiguration.areOffsiteTotalsCorrect
    }

    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, { extractionConfiguration, validationConfiguration })

    expect(response.validation.isVersion4).toBe(true)
    expect(response.validation.isOffsiteDataPresent).toBe(false)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(true)
  })
})
