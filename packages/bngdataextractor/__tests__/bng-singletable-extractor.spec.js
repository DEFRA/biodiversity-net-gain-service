import fs from 'fs'
import path from 'path'
import BngMetricSingleDataExtractor from '../src/extractors/BngMetricSingleDataExtractor'
import {
  habitatBaselineExtractionConfig, startExtractionConfig
} from '../src/extractors/extractionconfig/configuration.js'

describe('BNG data extractor test', () => {
  let readableStream, bngMetricDataExtractor
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages', 'bng-metric-service', '__tests__/metricfiles/metric-file.xlsm')))
    bngMetricDataExtractor = new BngMetricSingleDataExtractor()
  })

  it('should be transfer excel stream to json for start', async () => {
    const response = await bngMetricDataExtractor.extractContent(readableStream, { start: startExtractionConfig })
    expect(response).not.toBeFalsy()
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

  it('should transform excel stream to json for A-1 Site Habitat Baseline', async () => {
    const response = await bngMetricDataExtractor.extractContent(readableStream, { habitatBaseline: habitatBaselineExtractionConfig })
    expect(response).not.toBeFalsy()
    expect(response.habitatBaseline.length).toBe(9)
    expect(response.habitatBaseline[0]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[1]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[2]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[3]['Broad habitat']).toBe('Grassland')
    expect(response.habitatBaseline[4]['Broad habitat']).toBe('Heathland and shrub')
    expect(response.habitatBaseline[5]['Broad habitat']).toBe('Woodland and forest')
  })
})
