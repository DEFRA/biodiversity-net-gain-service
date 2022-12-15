import fs from 'fs'
import path from 'path'
import extractMetricContent from '../src/helpers/bng-metric-extraction-service.js'
jest.mock('../src/service.js')

describe('BNG data extrator service test', () => {
  let readableStream
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages/bng-metric-service/__mock-data__/metric-file', 'metric-file.xlsm')))
  })

  it('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    // const spy = jest.spyOn(bngMetricService, 'extractMetricContent').mockImplementation(contentInputStream => {})
    const response = await extractMetricContent(readableStream)
    expect(Object.keys(response).length).toBe(2)
    // expect(spy).toHaveBeenCalled()
  })
})
