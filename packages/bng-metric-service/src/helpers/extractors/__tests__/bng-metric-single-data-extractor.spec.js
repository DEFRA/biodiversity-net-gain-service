import fs from 'fs'
import BngMetricSingleDataExtractor from '../bng-metric-single-data-extractor.js'
import bngMetricService from '../../../service.js'
import areOffsiteTotalsCorrect from '../validation-config/are-offsite-totals-correct.js'

const options = {
  extractionConfiguration: {
    start: bngMetricService.extractionConfiguration.startExtractionConfig,
    ...bngMetricService.extractionConfiguration['v4.1']
  },
  validationConfiguration: bngMetricService.validationConfiguration
}

describe('BNG data extractor test', () => {
  it('should extract a valid metric v4.1', async () => {
    const readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.1.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = await bngMetricDataExtractor.extractContent(readableStreamv4, options)
    expect(response.d1OffSiteHabitatBaseline.length).toEqual(6)
    expect(Object.keys(response.d1OffSiteHabitatBaseline[0]).length).toEqual(10)
    expect(response.d1OffSiteHabitatBaseline[0].Ref).toEqual(1)
    expect(response.d1OffSiteHabitatBaseline[0]['Broad habitat']).toEqual('Cropland')
    expect(response.d1OffSiteHabitatBaseline[0]['Habitat type']).toEqual('Cereal crops')
    expect((response.d1OffSiteHabitatBaseline[0]['Area (hectares)']).toFixed(2)).toEqual('1.00')
    expect(response.d1OffSiteHabitatBaseline[0]['Area enhanced']).toEqual(0)
    expect(response.d1OffSiteHabitatBaseline[0].Condition).toEqual('Condition Assessment N/A')
    expect((response.d1OffSiteHabitatBaseline[0]['Total habitat units']).toFixed(2)).toEqual('2.00')
    expect(response.d1OffSiteHabitatBaseline[0]['Habitat reference Number']).toEqual('H1')
    expect(response.d1OffSiteHabitatBaseline[0]['Off-site reference']).toEqual(1234)
    expect(response.d1OffSiteHabitatBaseline[0]['Strategic significance']).toEqual('Area/compensation not in local strategy/ no local strategy')

    expect(response.d2OffSiteHabitatCreation.length).toEqual(4)
    expect(Object.keys(response.d2OffSiteHabitatCreation[0]).length).toEqual(11)
    expect(response.d2OffSiteHabitatCreation[0]['Broad habitat']).toEqual('Grassland')
    expect(response.d2OffSiteHabitatCreation[0]['Proposed habitat']).toEqual('Other neutral grassland')
    expect((response.d2OffSiteHabitatCreation[0]['Area (hectares)']).toFixed(2)).toEqual('2.00')
    expect(response.d2OffSiteHabitatCreation[0].Condition).toEqual('Fairly Good')
    expect(response.d2OffSiteHabitatCreation[0]['Habitat created in advance (years)']).toEqual(0)
    expect(response.d2OffSiteHabitatCreation[0]['Delay in starting habitat creation (years)']).toEqual(0)
    expect((response.d2OffSiteHabitatCreation[0]['Habitat units delivered']).toFixed(2)).toEqual('15.59')
    expect(response.d2OffSiteHabitatCreation[0]['Habitat reference Number']).toEqual('H1')
    expect(response.d2OffSiteHabitatCreation[0]['Off-site reference']).toEqual('BNGREG-0001')
    expect(response.d2OffSiteHabitatCreation[0]['Strategic significance']).toEqual('Area/compensation not in local strategy/ no local strategy')
    expect(response.d2OffSiteHabitatCreation[0]['User baseline ref']).toEqual(1)

    expect(response.d3OffSiteHabitatEnhancement.length).toEqual(3)
    expect(Object.keys(response.d3OffSiteHabitatEnhancement[0]).length).toEqual(15)
    expect(response.d3OffSiteHabitatEnhancement[0]['Baseline ref']).toEqual(3)
    expect(response.d3OffSiteHabitatEnhancement[0]['Baseline habitat']).toEqual('Grassland - Modified grassland')
    expect(response.d3OffSiteHabitatEnhancement[0]['Proposed habitat']).toEqual('Other neutral grassland')
    expect(response.d3OffSiteHabitatEnhancement[0]['Proposed Broad Habitat']).toEqual('Grassland')
    expect((response.d3OffSiteHabitatEnhancement[0]['Area (hectares)']).toFixed(2)).toEqual('0.40')
    expect(response.d3OffSiteHabitatEnhancement[0].Condition).toEqual('Moderate')
    expect(response.d3OffSiteHabitatEnhancement[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.d3OffSiteHabitatEnhancement[0]['Delay in starting habitat enhancement (years)']).toEqual(0)
    expect(response.d3OffSiteHabitatEnhancement[0]['Habitat units delivered']).toEqual(3.128519384528)
    expect((response.d3OffSiteHabitatEnhancement[0]['Total habitat area']).toFixed(2)).toEqual('0.40')
    expect(response.d3OffSiteHabitatEnhancement[0]['Distinctiveness change']).toEqual('Low - Medium')
    expect(response.d3OffSiteHabitatEnhancement[0]['Condition change']).toEqual('Lower Distinctiveness Habitat - Moderate')
    expect(response.d3OffSiteHabitatEnhancement[0]['Habitat reference Number']).toEqual('H3')
    expect(response.d3OffSiteHabitatEnhancement[0]['Off-site reference']).toEqual(1234)

    expect(response.e1OffSiteHedgeBaseline.length).toEqual(2)
    expect(Object.keys(response.e1OffSiteHedgeBaseline[0]).length).toEqual(10)
    expect(response.e1OffSiteHedgeBaseline[0].Ref).toEqual(1)
    expect(response.e1OffSiteHedgeBaseline[0]['Habitat type']).toEqual('Native hedgerow')
    expect(response.e1OffSiteHedgeBaseline[0]['Length (km)']).toEqual(0.3)
    expect(response.e1OffSiteHedgeBaseline[0]['Length enhanced']).toEqual(0.226)
    expect(response.e1OffSiteHedgeBaseline[0].Condition).toEqual('Poor')
    expect((response.e1OffSiteHedgeBaseline[0]['Total hedgerow units']).toFixed(2)).toEqual('0.60')
    expect(response.e1OffSiteHedgeBaseline[0]['Hedge number']).toEqual(1)
    expect(response.e1OffSiteHedgeBaseline[0]['Habitat reference Number']).toEqual('E1')
    expect(response.e1OffSiteHedgeBaseline[0]['Off-site reference']).toEqual(1234)
    expect(response.e1OffSiteHedgeBaseline[0]['Strategic significance']).toEqual('Area/compensation not in local strategy/ no local strategy')

    expect(response.e2OffSiteHedgeCreation.length).toEqual(2)
    expect(Object.keys(response.e2OffSiteHedgeCreation[0]).length).toEqual(10)
    expect(response.e2OffSiteHedgeCreation[0]['Habitat type']).toEqual('Species-rich native hedgerow')
    expect(response.e2OffSiteHedgeCreation[0]['Length (km)']).toEqual(0.074)
    expect(response.e2OffSiteHedgeCreation[0].Condition).toEqual('Good')
    expect(response.e2OffSiteHedgeCreation[0]['Habitat created in advance (years)']).toEqual(0)
    expect(response.e2OffSiteHedgeCreation[0]['Delay in starting habitat creation (years)']).toEqual(0)
    expect((response.e2OffSiteHedgeCreation[0]['Hedge units delivered']).toFixed(2)).toEqual('0.58')
    expect(response.e2OffSiteHedgeCreation[0]['Habitat reference Number']).toEqual('H1')
    expect(response.e2OffSiteHedgeCreation[0]['Off-site reference']).toEqual('BNGREG-0001')
    expect(response.e2OffSiteHedgeCreation[0]['Strategic significance']).toEqual('Area/compensation not in local strategy/ no local strategy')
    expect(response.e2OffSiteHedgeCreation[0]['User baseline ref']).toEqual(1)

    expect(Object.keys(response.e3OffSiteHedgeEnhancement[0]).length).toEqual(12)
    expect(response.e3OffSiteHedgeEnhancement[0]['Baseline ref']).toEqual(1)
    expect(response.e3OffSiteHedgeEnhancement[0]['Baseline habitat']).toEqual('Native hedgerow')
    expect(response.e3OffSiteHedgeEnhancement[0]['Length (km)']).toEqual(0.226)
    expect(response.e3OffSiteHedgeEnhancement[0].Condition).toEqual('Moderate')
    expect(response.e3OffSiteHedgeEnhancement[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.e3OffSiteHedgeEnhancement[0]['Hedge units delivered']).toEqual(1.7017262107027602)
    expect(response.e3OffSiteHedgeEnhancement[0]['Proposed habitat']).toEqual('Native hedgerow - associated with bank or ditch')
    expect(response.e3OffSiteHedgeEnhancement[0]['Habitat reference Number']).toEqual('E3')
    expect(response.e3OffSiteHedgeEnhancement[0]['Off-site reference']).toEqual(1234)
    expect(response.e3OffSiteHedgeEnhancement[0]['Strategic significance']).toEqual('Location ecologically desirable but not in local strategy')
    expect(response.e3OffSiteHedgeEnhancement[0].Distinctiveness).toEqual('Medium')

    expect(response.f1OffSiteWaterCBaseline.length).toEqual(2)
    expect(Object.keys(response.f1OffSiteWaterCBaseline[0]).length).toEqual(11)
    expect(response.f1OffSiteWaterCBaseline[0].Ref).toEqual(1)
    expect(response.f1OffSiteWaterCBaseline[0]['Watercourse type']).toEqual('Other rivers and streams')
    expect(response.f1OffSiteWaterCBaseline[0]['Length (km)']).toEqual(1)
    expect(response.f1OffSiteWaterCBaseline[0].Condition).toEqual('Poor')
    expect((response.f1OffSiteWaterCBaseline[0]['Total watercourse units']).toFixed(2)).toEqual('6.27')
    expect(response.f1OffSiteWaterCBaseline[0]['Habitat reference Number']).toEqual('F1')
    expect(response.f1OffSiteWaterCBaseline[0]['Off-site reference']).toEqual(1234)
    expect(response.f1OffSiteWaterCBaseline[0]['Extent of encroachment']).toEqual('No Encroachment')
    expect(response.f1OffSiteWaterCBaseline[0]['Extent of encroachment for both banks']).toEqual('Minor/ Minor')
    expect(response.f1OffSiteWaterCBaseline[0]['Strategic significance']).toEqual('Location ecologically desirable but not in local strategy')

    expect(response.f2OffSiteWaterCCreation.length).toEqual(2)
    expect(Object.keys(response.f2OffSiteWaterCCreation[0]).length).toEqual(3)
    expect(response.f2OffSiteWaterCCreation[0]['Length (km)']).toEqual(undefined)
    expect(response.f2OffSiteWaterCCreation[0].Condition).toEqual(undefined)
    expect(response.f2OffSiteWaterCCreation[0]['Habitat created in advance (years)']).toEqual(undefined)
    expect(response.f2OffSiteWaterCCreation[0]['Delay in starting habitat creation (years)']).toEqual(undefined)
    expect((response.f2OffSiteWaterCCreation[0]['Watercourse units delivered'])).toEqual('')
    expect(response.f2OffSiteWaterCCreation[0]['Habitat reference Number']).toEqual('F2')
    expect(response.f2OffSiteWaterCCreation[0]['Off-site reference']).toEqual(1234)
    expect(response.f2OffSiteWaterCCreation[0]['Extent of encroachment for both banks']).toEqual(undefined)
    expect(response.f2OffSiteWaterCCreation[0]['Extent of encroachment']).toEqual(undefined)
    expect(response.f2OffSiteWaterCCreation[0]['Strategic significance']).toEqual(undefined)
    expect(response.f2OffSiteWaterCCreation[0]['Watercourse type']).toEqual(undefined)

    expect(response.f3OffSiteWaterCEnhancement.length).toEqual(2)
    expect(Object.keys(response.f3OffSiteWaterCEnhancement[0]).length).toEqual(13)
    expect(response.f3OffSiteWaterCEnhancement[0]['Baseline ref']).toEqual(1)
    expect(response.f3OffSiteWaterCEnhancement[0]['Baseline habitat']).toEqual('Other rivers and streams')
    expect(response.f3OffSiteWaterCEnhancement[0]['Proposed habitat']).toEqual('Other rivers and streams')
    expect(response.f3OffSiteWaterCEnhancement[0]['Length (km)']).toEqual(1)
    expect(response.f3OffSiteWaterCEnhancement[0].Condition).toEqual('Good')
    expect(response.f3OffSiteWaterCEnhancement[0]['Habitat enhanced in advance (years)']).toEqual(0)
    expect(response.f3OffSiteWaterCEnhancement[0]['Delay in starting habitat enhancement (years)']).toEqual(0)
    expect(response.f3OffSiteWaterCEnhancement[0]['Watercourse units delivered']).toEqual(11.443784810433002)
    expect(response.f3OffSiteWaterCEnhancement[0]['Habitat reference Number']).toEqual('F3')
    expect(response.f3OffSiteWaterCEnhancement[0]['Off-site reference']).toEqual(1234)
    expect(response.f3OffSiteWaterCEnhancement[0]['Extent of encroachment']).toEqual('No Encroachment')
    expect(response.f3OffSiteWaterCEnhancement[0]['Extent of encroachment for both banks']).toEqual('Minor/ Minor')
    expect(response.f3OffSiteWaterCEnhancement[0]['Strategic significance']).toEqual('Area/compensation not in local strategy/ no local strategy')

    expect(response.validation.isSupportedVersion).toBe(true)
    expect(response.validation.isOffsiteDataPresent).toBe(true)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(true)
  })

  it('Should fail validation if not v4.1 metric', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.0.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, options)

    expect(response.validation.isSupportedVersion).toBe(false)
    expect(response.validation.isOffsiteDataPresent).toBe(true)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(true)
  })
  it('Should fail validation if not Offsite Totals not correct', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.1-invalid.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, options)

    expect(response.validation.isSupportedVersion).toBe(true)
    expect(response.validation.isOffsiteDataPresent).toBe(true)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(false)
  })
  it('Should fail validation if v4.1 metric without data', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.1-invalid.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, options)

    expect(response.validation.isSupportedVersion).toBe(true)
    expect(response.validation.isOffsiteDataPresent).toBe(true)
    expect(response.validation.areOffsiteTotalsCorrect).toBe(false)
  })

  it('Offsite totals check should handle floating point rounding errors', async () => {
    const mockWorkbookData = {
      Sheets: {
        'D-1 Off-Site Habitat Baseline': { H259: { v: 5.699999999999999 } },
        'D-2 Off-Site Habitat Creation': { G257: { v: 4.4 } },
        'D-3 Off-Site Habitat Enhancment': { V259: { v: 1.3 } },
        'E-1 Off-Site Hedge Baseline': { E258: { v: 5.700000000000001 } },
        'E-2 Off-Site Hedge Creation': { E260: { v: 4.4 } },
        'E-3 Off-Site Hedge Enhancement': { P258: { v: 1.3 } },
        'F-1 Off-Site WaterC\' Baseline': { E258: { v: 0.0 } },
        'F-2 Off-Site WaterC\' Creation': { D260: { v: 0.0 } },
        'F-3 Off-Site WaterC Enhancement': { Q258: { v: 0.0 } }
      }
    }
    const response = areOffsiteTotalsCorrect(mockWorkbookData)
    expect(response).toBe(true)
  })

  it('Should fail with error if no config', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.1-empty.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    try {
      await bngMetricDataExtractor.extractContent(readableStreamv3, {})
    } catch (error) {
      expect(error.message).toEqual('Workbook is not a valid metric')
    }
  })

  it('Should remove a column without error', async () => {
    const readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.1.xlsm')
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

  it('Should remove unwanted rows that only have data for the headers detailed in template', async () => {
    const readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.1.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const baselineRef = 'Ref'
    const habitatType = 'Habitat type'
    const extractionConfiguration = {
      test: {
        sheetName: 'D-1 Off-Site Habitat Baseline',
        startCell: 'D10',
        cellHeaders: [baselineRef, habitatType],
        columnsToBeRemoved: [],
        rowsToBeRemovedTemplate: [[baselineRef], [habitatType]]
      }
    }

    const response = await bngMetricDataExtractor.extractContent(readableStreamv4, { extractionConfiguration })
    expect(response.test.length).toEqual(5)
    response.test.forEach(element => expect(Object.keys(element)).toEqual([baselineRef, habitatType]))
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
    const readableStreamv4 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.1.xlsm')
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

  it('Should reject if not a valid metric spreadsheet', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/macro-enabled-test.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    await expect(bngMetricDataExtractor.extractContent(readableStreamv3, {})).rejects.toEqual(new Error('Workbook is not a valid metric'))
  })

  it('Should reject if metric-4.1 is draft version', async () => {
    const readableStreamv3 = fs.createReadStream('packages/bng-metric-service/src/__mock-data__/metric-file/metric-4.1-draft.xlsm')
    const bngMetricDataExtractor = new BngMetricSingleDataExtractor()
    const response = await bngMetricDataExtractor.extractContent(readableStreamv3, options)
    await expect(response.validation.isDraftVersion).toBe(true)
  })
})
