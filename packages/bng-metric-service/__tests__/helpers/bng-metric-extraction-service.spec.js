import fs from 'fs'
import path from 'path'
import bngMetricService from '../../src/service.js'

describe('BNG data extractor test', () => {
  let readableStream
  const currentPath = process.cwd()
  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'metric-file.xlsm')))
  })

  it('should be transfer excel stream to json for start', async () => {
    const response = await bngMetricService.extractMetricContent(readableStream, { start: bngMetricService.config.startExtractionConfig })
    expect(response).toBeTruthy()
    expect(response.start.projectName).toBe('Metric extraction Project')
    expect(response.start.applicant).toBe('A Developer')
    expect(response.start.applicationType).toBe('Outline Planning')
    expect(response.start.planningApplicationReference).toBe(123456789)
    expect(response.start.assessor).toBe('Test Assessor')
    expect(response.start.reviewer).toBe('Test Reviewer')
    expect(response.start.metricVersion).toBe('v4.0')
    expect(response.start.assessmentDate).toBe(44441)
    expect(response.start.planningAuthorityReviewer).toBe('Test Authority Reviewer')
    expect(response.start.planningAuthority).toBe('Test Planning')
  })

  it('should be transfer excel stream to json for start with endcell', async () => {
    const startExtractionConfig = bngMetricService.config.startExtractionConfig
    startExtractionConfig.endCell = 'F16'
    const response = await bngMetricService.extractMetricContent(readableStream, { start: startExtractionConfig })
    expect(response).toBeTruthy()
    expect(response.start.planningAuthority).toBe('Test Planning')
    expect(response.start.projectName).toBe('Metric extraction Project')
    expect(response.start.applicant).toBe('A Developer')
    expect(response.start.applicationType).toBe('Outline Planning')
    expect(response.start.planningApplicationReference).toBe(123456789)
    expect(response.start.assessor).toBe('Test Assessor')
    expect(response.start.reviewer).toBeUndefined()
    expect(response.start.metricVersion).toBeUndefined()
    expect(response.start.assessmentDate).toBeUndefined()
    expect(response.start.planningAuthorityReviewer).toBeUndefined()
  })

  it('should transform excel stream to json for D-1 Off-Site Habitat Baseline', async () => {
    const offSiteHabitatBaselineExtractionConfig = bngMetricService.config.offSiteHabitatBaselineExtractionConfig
    offSiteHabitatBaselineExtractionConfig.endCell = 'AF12'
    const response = await bngMetricService.extractMetricContent(readableStream, { habitatBaseline: bngMetricService.config.offSiteHabitatBaselineExtractionConfig })
    const mockBaselineData = { areaHectares: 1, areaLost: 1, baselineRef: 1, baselineUnitsEnhanced: 0, baselineUnitsRetained: 0, broadHabitat: 'Grassland', condition7: 'Fairly Good', distinctiveness: 'High', habitatType3: 'Grassland - Traditional orchards', habitatType: 'Traditional orchards', score: 6, score1: 2.5, spatialRiskMultiplier: '', strategicPositionMultiplier: 1.15, strategicSignificance: 'Formally identified in local strategy', strategicSignificance1: 'High strategic significance ', totalHabitatUnits: 'Check Data ⚠', totalHabitatUnits1: 17.25, unitsLost: 17.25 }

    expect(response).toBeTruthy()
    expect(response.habitatBaseline.length).toBe(2)
    expect(response.habitatBaseline[0]).toEqual(mockBaselineData)
  })

  it('must have habitat baseline config to extract D-1 Off-Site Habitat Baseline sheet', async () => {
    const response = await bngMetricService.extractMetricContent(readableStream, { habitatBaseline: undefined })

    expect(response).toBeTruthy()
    expect(response.habitatBaseline).toBeNull()
  })

  it('should return null if sheetName does not exists', async () => {
    const response = await bngMetricService.extractMetricContent(readableStream, { habitatBaseline: { sheetName: undefined } })

    expect(response).toBeTruthy()
    expect(response.habitatBaseline).toBeNull()
  })

  it('should not return extracted metric data if raw data does not exists', async () => {
    const offSiteHabitatBaselineExtractionConfig = bngMetricService.config.offSiteHabitatBaselineExtractionConfig
    const _readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'metric-file-empty.xlsx')))
    const response = await bngMetricService.extractMetricContent(_readableStream, { habitatBaseline: offSiteHabitatBaselineExtractionConfig })

    expect(response).toBeTruthy()
    expect(response.habitatBaseline[0]).toEqual({})
  })
})

describe('BNG data extractor service test', () => {
  const currentPath = process.cwd()

  it('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    const readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'metric-file.xlsm')))
    const extractionConfiguration = {
      startPage: bngMetricService.config.startExtractionConfig,
      siteHabitatBaseline: bngMetricService.config.offSiteHabitatBaselineExtractionConfig
    }
    const response = await bngMetricService.extractMetricContent(readableStream, extractionConfiguration)
    expect(Object.keys(response).length).toBe(2)
  })

  it('must have file stream input to the function otherwise throws exception', async () => {
    const readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'forbidden.xlsx')))
    const extractionConfiguration = {
      startPage: bngMetricService.config.startExtractionConfig,
      siteHabitatBaseline: bngMetricService.config.offSiteHabitatBaselineExtractionConfig
    }

    try {
      await bngMetricService.extractMetricContent(readableStream, extractionConfiguration)
    } catch (error) {
      expect(error).toBeDefined()
      expect(error.message).toContain('EACCES: permission denied')
    }
  })
})
