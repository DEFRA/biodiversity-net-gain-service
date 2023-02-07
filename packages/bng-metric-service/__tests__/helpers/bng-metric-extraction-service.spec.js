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
    const startExtractionConfig = bngMetricService.config.offSiteHabitatBaselineExtractionConfig
    startExtractionConfig.endCell = 'AF12'
    const response = await bngMetricService.extractMetricContent(readableStream, { habitatBaseline: bngMetricService.config.offSiteHabitatBaselineExtractionConfig })
    const mockBaselineData = { areaHectares: 1, areaLost: 1, baselineRef: 1, baselineUnitsEnhanced: 0, baselineUnitsRetained: 0, broadHabitat: 'Grassland', condition: 'Fairly Good', distinctiveness: 'High', habitatType: 'Grassland - Traditional orchards', score: 6, spatialRiskCategory: null, spatialRiskMultiplier: '', strategicPositionMultiplier: 1.15, strategicSignificance: 'Formally identified in local strategy', totalHabitatUnits: 'Check Data ⚠', totalHabitatUnits1: 17.25, unitsLost: 17.25 }

    expect(response).toBeTruthy()
    expect(response.habitatBaseline.length).toBe(2)
    expect(response.habitatBaseline[0]).toEqual(mockBaselineData)
  })
})

describe('BNG data extractor service test', () => {
  let readableStream
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'metric-file.xlsm')))
  })

  it('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    const extractionConfiguration = {
      startPage: bngMetricService.config.startExtractionConfig,
      siteHabitatBaseline: bngMetricService.config.offSiteHabitatBaselineExtractionConfig
    }
    const response = await bngMetricService.extractMetricContent(readableStream, extractionConfiguration)
    expect(Object.keys(response).length).toBe(2)
  })
})
