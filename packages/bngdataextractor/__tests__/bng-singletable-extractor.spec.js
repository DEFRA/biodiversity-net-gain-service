import fs from 'fs'
import path from 'path'
import BNGMetrixSingleTableExtracrtor from '../src/extractors/BNGMetrixSingleDataExtracrtor'
import {
  habitatBaselineExtractionConfig, startExtractionConfig
} from '../src/extractors/extractionconfig/configuration.js'

describe('BNG data extractor test', () => {
  let readableStream
  let bNGMetrixDataExtracrtor
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages', 'bngdataextractor', '__tests__/metricfiles/metric-file.xlsm')))
    bNGMetrixDataExtracrtor = new BNGMetrixSingleTableExtracrtor()
  })

  afterEach(() => {
    readableStream = undefined
    bNGMetrixDataExtracrtor = undefined
  })

  it('should transfor excel stream to json for start', async () => {
    const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, { start: startExtractionConfig })
    expect(response).not.toBeFalsy()
    expect(response.start['Project name']).toBe('Metric extraction Project')
    expect(response.start.Applicant).toBe('A Developer')
    expect(response.start['Application type']).toBe('Outline Planning')
    expect(response.start['Planning application reference']).toBe(123456789)
    expect(response.start.Assessor).toBe('Paul Mcomick')
    expect(response.start.Reviewer).toBe('Mark keeling')
    expect(response.start['Metric version']).toBe(3)
    expect(response.start['Assessment date']).toBe(44441)
    expect(response.start['Planning authority reviewer']).toBe('Nick allen')
    expect(response.start['Planning authority']).toBe('Bromley')
  })

  it('should transform excel stream to json for A-1 Site Habitat Baseline', async () => {
    const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, { habitatBaseline: habitatBaselineExtractionConfig })
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
