import fs from 'fs'
import path from 'path'
import BNGMatricHabitatGroupExtracrtor from '../src/extractors/bng-habitatgroup-extractor'
import { habitatGroupExtractionConfig } from '../src/extractors/extractionconfig/configuration.js'
import xslx from 'xlsx'

describe('BNG data extractor test', () => {
  let readableStream
  let bNGMatricDataExtractor

  beforeEach(() => {
    readableStream = fs.createReadStream(path.join(path.resolve(), '__tests__/metricfiles/biodiversity30.xlsm'))
    bNGMatricDataExtractor = new BNGMatricHabitatGroupExtracrtor()
  })

  afterEach(() => {
    readableStream = undefined
    bNGMatricDataExtractor = undefined
  })

  it('should transform excel stream to json G-2 Habitat groups', async () => {
    const workBook = await createWorkbook(readableStream)

    const response = await bNGMatricDataExtractor.extractHabitatGroup(workBook, habitatGroupExtractionConfig)
    expect(response).not.toBeFalsy()
    expect(response.allHabitatData.data.length).toBe(135)
    expect(response.hedgeGrowAndTrees.data.length).toBe(16)
    expect(response.riversAndStreams.data.length).toBe(7)
    expect(response.groupSubTotals.data.length).toBe(27)
    expect(response.distinctiveBandVeryHigh.data.length).toBe(20)
    expect(response.distinctiveBandHigh.data.length).toBe(42)
    expect(response.distinctiveBandMedium.data.length).toBe(27)
    expect(response.distinctiveBandLow.data.length).toBe(37)
    expect(response.distinctiveBandVeryLow.data.length).toBe(5)
  })

  const createWorkbook = (contentInputStream) => {
    return new Promise((resolve, reject) => {
      const data = []
      contentInputStream.on('data', (chunk) => {
        data.push(chunk)
      })

      contentInputStream.on('end', () => {
        const workBook = xslx.read(Buffer.concat(data), { type: 'buffer' })
        resolve(workBook)
      })

      contentInputStream.on('error', (err) => {
        reject(err)
      })
    })
  }
})
