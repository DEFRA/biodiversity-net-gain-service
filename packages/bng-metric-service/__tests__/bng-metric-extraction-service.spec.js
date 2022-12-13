import fs from 'fs'
import path from 'path'
import { extractMetricContent } from '../src/service.js'
jest.mock('../src/service.js')

describe('BNG data extrator service test', () => {
  let readableStream
  const currentPath = process.cwd()

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(currentPath, 'packages', 'bng-metric-service', '__tests__/metricfiles/metric-file.xlsm')))
  })

  it.skip('must extract all the configured excel sheets in a biodiversity metric file', async () => {
    const response = await extractMetricContent(readableStream)
    expect(Object.keys(response).length).toBe(2)
  })
})
