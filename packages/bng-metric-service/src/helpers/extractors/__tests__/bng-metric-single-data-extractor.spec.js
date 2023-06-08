import fs from 'fs'
import BngMetricSingleDataExtractor from '../bng-metric-single-data-extractor.js'
import bngMetricService from '../../../service.js'

const options = {
  extractionConfiguration: {
    start: bngMetricService.extractionConfiguration.startExtractionConfig,
    ...bngMetricService.extractionConfiguration['v4.0']
  },
  validationConfiguration: bngMetricService.validationConfiguration
}

describe('BNG data extractor test', () => {
  it('should extract a valid metric v4', async () => {
    const readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = await bngMetricDataExtractor.extractContent(readableStreamv4, options)

    expect(response.d1OffSiteHabitatBaseline.length).toEqual(5)
    expect(Object.keys(response.d1OffSiteHabitatBaseline[0]).length).toEqual(6)
    expect(response.d1OffSiteHabitatBaseline[0]['Broad habitat']).toEqual('Cropland')
    expect(response.d1OffSiteHabitatBaseline[0]['Habitat type']).toEqual('Cereal crops')
    expect((response.d1OffSiteHabitatBaseline[0]['Area (hectares)']).toFixed(2)).toEqual('1.00')
    expect(response.d1OffSiteHabitatBaseline[0].Condition).toEqual('Condition Assessment N/A')
    expect((response.d1OffSiteHabitatBaseline[0]['Total habitat units']).toFixed(2)).toEqual('2.00')

    expect(response.d2OffSiteHabitatCreation.length).toEqual(3)
    expect(Object.keys(response.d2OffSiteHabitatCreation[0]).length).toEqual(7)
    expect(response.d2OffSiteHabitatCreation[0]['Broad habitat']).toEqual('Grassland')
    expect(response.d2OffSiteHabitatCreation[0]['Proposed habitat']).toEqual('Other neutral grassland')
    expect((response.d2OffSiteHabitatCreation[0]['Area (hectares)']).toFixed(2)).toEqual('0.90')
    expect(response.d2OffSiteHabitatCreation[0].Condition).toEqual('Fairly Good')
    expect(response.d2OffSiteHabitatCreation[0]['Habitat created in advance (years)']).toEqual(0)
    expect(response.d2OffSiteHabitatCreation[0]['Delay in starting habitat creation (years)']).toEqual(0)
    expect((response.d2OffSiteHabitatCreation[0]['Habitat units delivered']).toFixed(2)).toEqual('7.01')

    expect(response.d3OffSiteHabitatEnhancement.length).toEqual(4)
    expect(Object.keys(response.d3OffSiteHabitatEnhancement[0]).length).toEqual(10)
    expect(response.d3OffSiteHabitatEnhancement[0]['Baseline habitat']).toEqual('Grassland - Modified grassland')
    expect(response.d3OffSiteHabitatEnhancement[0]['Proposed habitat']).toEqual('Lowland raised bog')
    expect(response.d3OffSiteHabitatEnhancement[0]['Proposed Broad Habitat']).toEqual('Wetland')
    expect((response.d3OffSiteHabitatEnhancement[0]['Area (hectares)']).toFixed(2)).toEqual('1.00')
    expect(response.d3OffSiteHabitatEnhancement[0].Condition).toEqual('Good')
    expect(response.d3OffSiteHabitatEnhancement[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.d3OffSiteHabitatEnhancement[0]['Delay in starting habitat enhancement (years)']).toEqual(0)
    expect((response.d3OffSiteHabitatEnhancement[0]['Habitat units delivered']).toFixed(2)).toEqual('7.03')

    expect(response.e1OffSiteHedgeBaseline.length).toEqual(3)
    expect(Object.keys(response.e1OffSiteHedgeBaseline[0]).length).toEqual(6)
    expect(response.e1OffSiteHedgeBaseline[0]['Hedgerow type']).toEqual('Native hedgerow - associated with bank or ditch')
    expect(response.e1OffSiteHedgeBaseline[0]['Length (km)']).toEqual(0.3)
    expect(response.e1OffSiteHedgeBaseline[0].Condition).toEqual('Poor')
    expect((response.e1OffSiteHedgeBaseline[0]['Total hedgerow units']).toFixed(2)).toEqual('1.20')

    expect(response.e2OffSiteHedgeCreation.length).toEqual(2)
    expect(Object.keys(response.e2OffSiteHedgeCreation[0]).length).toEqual(7)
    expect(response.e2OffSiteHedgeCreation[0]['Habitat type']).toEqual('Native hedgerow with trees')
    expect(response.e2OffSiteHedgeCreation[0]['Length (km)']).toEqual(0.3)
    expect(response.e2OffSiteHedgeCreation[0].Condition).toEqual('Good')
    expect(response.e2OffSiteHedgeCreation[0]['Habitat created in advance (years)']).toEqual(0)
    expect(response.e2OffSiteHedgeCreation[0]['Delay in starting habitat creation (years)']).toEqual(0)
    expect((response.e2OffSiteHedgeCreation[0]['Hedge units delivered']).toFixed(2)).toEqual('1.77')

    expect(response.e3OffSiteHedgeEnhancement.length).toEqual(2)
    expect(Object.keys(response.e3OffSiteHedgeEnhancement[0]).length).toEqual(8)
    expect(response.e3OffSiteHedgeEnhancement[0]['Baseline habitat']).toEqual('Native hedgerow - associated with bank or ditch')
    expect(response.e3OffSiteHedgeEnhancement[0]['Length (km)']).toEqual(0.3)
    expect(response.e3OffSiteHedgeEnhancement[0].Condition).toEqual('Moderate')
    expect(response.e3OffSiteHedgeEnhancement[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.e3OffSiteHedgeEnhancement[0]['Delay in starting habitat enhancement (years)']).toEqual(0)
    expect((response.e3OffSiteHedgeEnhancement[0]['Hedge units delivered']).toFixed(2)).toEqual('2.28')

    expect(response.f1OffSiteWaterCBaseline.length).toEqual(3)
    expect(Object.keys(response.f1OffSiteWaterCBaseline[0]).length).toEqual(5)
    expect(response.f1OffSiteWaterCBaseline[0]['Watercourse type']).toEqual('Ditches')
    expect(response.f1OffSiteWaterCBaseline[0]['Length (km)']).toEqual(0.3)
    expect(response.f1OffSiteWaterCBaseline[0].Condition).toEqual('Poor')
    expect((response.f1OffSiteWaterCBaseline[0]['Total watercourse units']).toFixed(2)).toEqual('1.20')

    expect(response.f2OffSiteWaterCCreation.length).toEqual(1)
    expect(Object.keys(response.f2OffSiteWaterCCreation[0]).length).toEqual(7)
    expect(response.f2OffSiteWaterCCreation[0]['Watercourse type']).toEqual('Ditches')
    expect(response.f2OffSiteWaterCCreation[0]['Length (km)']).toEqual(0.3)
    expect(response.f2OffSiteWaterCCreation[0].Condition).toEqual('Fairly Good')
    expect(response.f2OffSiteWaterCCreation[0]['Habitat created in advance (years)']).toEqual(0)
    expect(response.f2OffSiteWaterCCreation[0]['Delay in starting habitat creation (years)']).toEqual(0)
    expect((response.f2OffSiteWaterCCreation[0]['Watercourse units delivered']).toFixed(2)).toEqual('2.59')

    expect(response.f3OffSiteWaterCEnhancement.length).toEqual(2)
    expect(Object.keys(response.f3OffSiteWaterCEnhancement[0]).length).toEqual(7)
    expect(response.f3OffSiteWaterCEnhancement[0]['Baseline habitat']).toEqual('Ditches')
    expect(response.f3OffSiteWaterCEnhancement[0]['Proposed habitat']).toEqual('Ditches')
    expect(response.f3OffSiteWaterCEnhancement[0]['Length (km)']).toEqual(0.3)
    expect(response.f3OffSiteWaterCEnhancement[0].Condition).toEqual('Good')
    expect(response.f3OffSiteWaterCEnhancement[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.f3OffSiteWaterCEnhancement[0]['Delay in starting habitat enhancement (years)']).toEqual(0)
    expect((response.f3OffSiteWaterCEnhancement[0]['Watercourse units delivered']).toFixed(2)).toEqual('2.41')

    expect(response.validation.isVersion4OrLater).toBe(true)
    expect(response.validation.isOffsiteDataPresent).toBe(true)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(true)
  })

  it('Should fail validation if not v4 metric', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-3.1.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, options)

    expect(response.validation.isVersion4OrLater).toBe(false)
    expect(response.validation.isOffsiteDataPresent).toBe(true)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(false)
  })
  it('Should fail validation if v4 metric without data', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0-empty.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, options)

    expect(response.validation.isVersion4OrLater).toBe(true)
    expect(response.validation.isOffsiteDataPresent).toBe(false)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(true)
  })

  it('Should return nothing if no config', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0-empty.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()

    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, {})

    expect(response).toEqual({})
  })

  it('Should remove a column without error', async () => {
    const readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const extractionConfiguration = {
      test: {
        sheetName: 'D-1 Off-Site Habitat Baseline',
        startCell: 'D10',
        cellHeaders: [
          'Habitat type',
          'Area (hectares)',
          'Condition',
          'Total habitat units'
        ],
        columnsToBeRemoved: [
          'Broad habitat'
        ],
        substitutions: {
          'Condition ': 'Condition'
        }
      }
    }

    const response = await bngMetricDataExtractor.extractContent(readableStreamv4, { extractionConfiguration })
    expect(Object.keys(response.test[0]).length).toEqual(4)
    expect(response.test[0]['Broad habitat']).toBe(undefined)
  })

  it('Should rejects with an error if a stream error occurs', async () => {
    const { PassThrough } = require('stream')
    jest.mock('../bng-metric-single-data-extractor.js')

    const mockReadable = new PassThrough()
    const mockError = new Error('mock file error')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = bngMetricDataExtractor.extractContent(mockReadable, { })
    mockReadable.emit('error', mockError)
    await expect(response).rejects.toEqual(mockError)
  })

  it('Should return data even if all extraction config properties are not provided', async () => {
    const readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const extractionConfiguration = {
      test: {
        sheetName: 'D-1 Off-Site Habitat Baseline',
        startCell: 'D10',
        cellHeaders: [
          'Habitat type'
        ],
        columnsToBeRemoved: [],
        substitutions: undefined,
        cells: [{ cell: '!ref' }]
      }
    }

    const response = await bngMetricDataExtractor.extractContent(readableStreamv4, { extractionConfiguration })
    expect(Object.keys(response.test[0]).length).toEqual(1)
    expect(response.test[0].Condition).toBe(undefined)
  })
})
