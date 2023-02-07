import fs from 'fs'
import path from 'path'
import extractMetricContent from '../../src/helpers/bng-metric-extraction-service.js'
import bngMetricService from '../../src/service.js'

describe('BNG data extractor test', () => {
  let readableStream
  const currentPath = process.cwd()
  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'metric-file.xlsm')))
  })

  it('should be transfer excel stream to json for start', async () => {
    const response = await extractMetricContent(readableStream, { start: bngMetricService.config.startExtractionConfig })
    expect(response).toBeTruthy()
    expect(response.start.projectName).toBe('Metric extraction Project')
    expect(response.start.applicant).toBe('A Developer')
    expect(response.start.applicationType).toBe('Outline Planning')
    expect(response.start.planningApplicationReference).toBe(123456789)
    expect(response.start.assessor).toBe('Paul Mcomick')
    expect(response.start.reviewer).toBe('Mark keeling')
    expect(response.start.metricVersion).toBe(3)
    expect(response.start.assessmentDate).toBe(44441)
    expect(response.start.planningAuthorityReviewer).toBe('Nick allen')
    expect(response.start.planningAuthority).toBe('Bromley')
  })

  it('should be transfer excel stream to json for start with endcell', async () => {
    const startExtractionConfig = bngMetricService.config.startExtractionConfig
    startExtractionConfig.endCell = 'F20'
    const response = await extractMetricContent(readableStream, { start: startExtractionConfig })
    expect(response).toBeTruthy()
    expect(response.start.projectName).toBe('Metric extraction Project')
    expect(response.start.applicant).toBe('A Developer')
    expect(response.start.applicationType).toBe('Outline Planning')
    expect(response.start.planningApplicationReference).toBe(123456789)
    expect(response.start.assessor).toBe('Paul Mcomick')
    expect(response.start.reviewer).toBe('Mark keeling')
    expect(response.start.metricVersion).toBe(3)
    expect(response.start.assessmentDate).toBe(44441)
    expect(response.start.planningAuthorityReviewer).toBe('Nick allen')
    expect(response.start.planningAuthority).toBe('Bromley')
  })

  it('should transform excel stream to json for D-1 Off-Site Habitat Baseline', async () => {
    const response = await extractMetricContent(readableStream, { habitatBaseline: bngMetricService.config.offSiteHabitatBaselineExtractionConfig })
    expect(response).toBeTruthy()
    expect(response.habitatBaseline.length).toBe(249)
    expect(response.habitatBaseline[0]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[1]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[2]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[3]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[4]['Broad habitat']).toBe('Heathland and shrub')
    expect(response.habitatBaseline[5]['Broad habitat']).toBe('Woodland and forest')
  })

  it('should transform excel stream to json for D-1 Off-Site Habitat Baseline if specified column to be removed', async () => {
    const habitatBaselineExtractionConfig = bngMetricService.config.offSiteHabitatBaselineExtractionConfig
    habitatBaselineExtractionConfig.columnsToBeRemoved.push('Score_1')
    const response = await extractMetricContent(readableStream, { habitatBaseline: habitatBaselineExtractionConfig })
    expect(response).toBeTruthy()
    expect(response.habitatBaseline.length).toBe(249)
    expect(response.habitatBaseline[0]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[1]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[2]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[3]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[4]['Broad habitat']).toBe('Heathland and shrub')
    expect(response.habitatBaseline[5]['Broad habitat']).toBe('Woodland and forest')
  })
})

describe('BNG data extractor service test', () => {
  let readableStream
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'metric-file.xlsm')))
  })

  it('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    const options = {
      extractionConfiguration: {
        startPage: bngMetricService.config.startExtractionConfig,
        siteHabitatBaseline: bngMetricService.config.offSiteHabitatBaselineExtractionConfig
      }
    }
    const response = await extractMetricContent(readableStream, options)
    expect(Object.keys(response).length).toBe(2)
  })
})
