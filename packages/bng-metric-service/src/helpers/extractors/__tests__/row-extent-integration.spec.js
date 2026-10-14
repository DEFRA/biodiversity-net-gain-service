import { Readable } from 'stream'
import xslx from 'xlsx'
import BngMetricSingleDataExtractor from '../bng-metric-single-data-extractor.js'
import d1OffSiteHabitatBaseline from '../extraction-config/metric/v4.1/d1-off-site-habitat-baseline.js'

// Builds a minimal, valid metric workbook at test-run-time (never hand-edited) with a configurable
// number of D-1 Off-Site Habitat Baseline data rows, to prove the extractor reads 1, 250 and 350 rows.
const buildMetricWorkbookBuffer = rowCount => {
  const workbook = xslx.utils.book_new()
  const emptySheet = xslx.utils.aoa_to_sheet([[]])
  xslx.utils.book_append_sheet(workbook, emptySheet, 'Start')
  xslx.utils.book_append_sheet(workbook, xslx.utils.aoa_to_sheet([[]]), 'Main Menu')
  xslx.utils.book_append_sheet(workbook, xslx.utils.aoa_to_sheet([[]]), 'Results')
  xslx.utils.book_append_sheet(workbook, xslx.utils.aoa_to_sheet([[]]), 'Headline Results')

  const headerRow = ['Ref', 'Total habitat units', 'Broad habitat', 'Habitat type', 'Area (hectares)', 'Area enhanced', 'Condition', 'Habitat reference Number', 'Off-site reference', 'Strategic significance']
  const aoa = Array.from({ length: 9 }, () => [])
  aoa.push(headerRow)
  for (let i = 1; i <= rowCount; i++) {
    aoa.push([i, i * 0.1, 'Cropland', 'Cereal crops', 1, 0, 'Good', `H${i}`, 1234, 'Area/compensation not in local strategy/ no local strategy'])
  }

  const d1Sheet = xslx.utils.aoa_to_sheet(aoa, { origin: 'D1' })
  xslx.utils.book_append_sheet(workbook, d1Sheet, 'D-1 Off-Site Habitat Baseline')

  return xslx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

const extractD1 = async rowCount => {
  const buffer = buildMetricWorkbookBuffer(rowCount)
  const extractor = new BngMetricSingleDataExtractor()
  const response = await extractor.extractContent(Readable.from(buffer), {
    extractionConfiguration: { d1OffSiteHabitatBaseline }
  })
  return response.d1OffSiteHabitatBaseline
}

describe('Dynamic row-extent detection (D-1 Off-Site Habitat Baseline)', () => {
  it('reads a workbook with a single data row', async () => {
    const rows = await extractD1(1)
    expect(rows.length).toEqual(1)
    expect(rows[0].Ref).toEqual(1)
  })

  it('reads a workbook at the old legacy row count (250 rows)', async () => {
    const rows = await extractD1(250)
    expect(rows.length).toEqual(250)
    expect(rows[249].Ref).toEqual(250)
  })

  it('reads a workbook at the new row count (350 rows), beyond the old maximum', async () => {
    const rows = await extractD1(350)
    expect(rows.length).toEqual(350)
    expect(rows[349].Ref).toEqual(350)
  })
})
