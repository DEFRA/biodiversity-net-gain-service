import { Readable } from 'stream'
import xslx from 'xlsx'
import BngMetricSingleDataExtractor from '../bng-metric-single-data-extractor.js'
import configuration from '../extraction-config/configuration.js'
import d1OffSiteHabitatBaseline from '../extraction-config/metric/v4.1/d1-off-site-habitat-baseline.js'
import d2OffSiteHabitatCreation from '../extraction-config/metric/v4.1/d2-off-site-habitat-creation.js'
import d3OffSiteHabitatEnhancement from '../extraction-config/metric/v4.1/d3-off-site-habitat-enhancement.js'
import e1OffSiteHedgeBaseline from '../extraction-config/metric/v4.1/e1-off-site-hedge-baseline.js'
import e2OffSiteHedgeCreation from '../extraction-config/metric/v4.1/e2-off-site-hedge-creation.js'
import e3OffSiteHedgeEnhancement from '../extraction-config/metric/v4.1/e3-off-site-hedge-enhancement.js'
import f1OffSiteWaterCBaseline from '../extraction-config/metric/v4.1/f1-off-site-waterC-baseline.js'
import f2OffSiteWaterCCreation from '../extraction-config/metric/v4.1/f2-off-site-waterC-creation.js'
import f3OffSiteWaterCEnhancement from '../extraction-config/metric/v4.1/f3-off-site-waterC-enhancement.js'

const addGateSheets = workbook => {
  ;['Start', 'Main Menu', 'Results', 'Headline Results'].forEach(name => {
    xslx.utils.book_append_sheet(workbook, xslx.utils.aoa_to_sheet([[]]), name)
  })
}

const startRowOf = cellAddress => parseInt(cellAddress.match(/\d+/)[0], 10)
const columnOf = cellAddress => cellAddress.match(/[A-Z]+/)[0]

// Cells added directly to a sheet (outside xslx.utils.aoa_to_sheet's own bounding box) are otherwise
// dropped on write, and lose their numeric type, unless the sheet range is widened and the type is set
const setCell = (sheet, address, value) => {
  sheet[address] = typeof value === 'number' ? { t: 'n', v: value } : { t: 's', v: value }
  const range = xslx.utils.decode_range(sheet['!ref'])
  const cell = xslx.utils.decode_cell(address)
  range.s.r = Math.min(range.s.r, cell.r)
  range.s.c = Math.min(range.s.c, cell.c)
  range.e.r = Math.max(range.e.r, cell.r)
  range.e.c = Math.max(range.e.c, cell.c)
  sheet['!ref'] = xslx.utils.encode_range(range)
}

// Baseline tabs (D-1, E-1, F-1): the ref/sequence column is the sheet's own first configured header ('Ref')
const buildBaselineWorkbook = (extractionConfiguration, rowCount) => {
  const workbook = xslx.utils.book_new()
  addGateSheets(workbook)
  const headerRow = startRowOf(extractionConfiguration.startCell)
  const aoa = Array.from({ length: headerRow - 1 }, () => [])
  aoa.push(extractionConfiguration.cellHeaders)
  for (let i = 1; i <= rowCount; i++) {
    aoa.push(extractionConfiguration.cellHeaders.map((header, idx) => (idx === 0 ? i : `v${idx}-${i}`)))
  }
  const sheet = xslx.utils.aoa_to_sheet(aoa, { origin: `${columnOf(extractionConfiguration.startCell)}1` })
  xslx.utils.book_append_sheet(workbook, sheet, extractionConfiguration.sheetName)
  return xslx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

// Creation tab D-2: the sequence column (B) sits outside the sheet's own visible extraction range
const buildCreationWorkbookRefOutsideRange = (extractionConfiguration, rowCount) => {
  const workbook = xslx.utils.book_new()
  addGateSheets(workbook)
  const headerRow = startRowOf(extractionConfiguration.startCell)
  const aoa = Array.from({ length: headerRow - 1 }, () => [])
  aoa.push(extractionConfiguration.cellHeaders)
  for (let i = 1; i <= rowCount; i++) {
    aoa.push(extractionConfiguration.cellHeaders.map((header, idx) => `v${idx}-${i}`))
  }
  const sheet = xslx.utils.aoa_to_sheet(aoa, { origin: `${columnOf(extractionConfiguration.startCell)}1` })
  for (let i = 1; i <= rowCount; i++) {
    setCell(sheet, `${extractionConfiguration.rowExtent.refColumn}${headerRow + i}`, i)
  }
  xslx.utils.book_append_sheet(workbook, sheet, extractionConfiguration.sheetName)
  return xslx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

// Creation tabs E-2, F-2: the sequence column ('Ref') is the first column of the visible extraction range,
// with the sheet's own configured headers following it
const buildCreationWorkbookRefInsideRange = (extractionConfiguration, rowCount) => {
  const workbook = xslx.utils.book_new()
  addGateSheets(workbook)
  const headerRow = startRowOf(extractionConfiguration.startCell)
  const headerValues = ['Ref', ...extractionConfiguration.cellHeaders]
  const aoa = Array.from({ length: headerRow - 1 }, () => [])
  aoa.push(headerValues)
  for (let i = 1; i <= rowCount; i++) {
    aoa.push(headerValues.map((header, idx) => (idx === 0 ? i : `v${idx}-${i}`)))
  }
  const sheet = xslx.utils.aoa_to_sheet(aoa, { origin: `${columnOf(extractionConfiguration.startCell)}1` })
  xslx.utils.book_append_sheet(workbook, sheet, extractionConfiguration.sheetName)
  return xslx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

// Enhancement tab D-3: no sequence column; the real last data row is found via a "total" label,
// placed one row after the preceding data rows
const buildLabelledEnhancementWorkbook = (extractionConfiguration, rowCount) => {
  const workbook = xslx.utils.book_new()
  addGateSheets(workbook)
  const headerRow = startRowOf(extractionConfiguration.startCell)
  const aoa = Array.from({ length: headerRow - 1 }, () => [])
  aoa.push(extractionConfiguration.cellHeaders)
  for (let i = 1; i <= rowCount; i++) {
    aoa.push(extractionConfiguration.cellHeaders.map((header, idx) => (idx === 0 ? i : `v${idx}-${i}`)))
  }
  const sheet = xslx.utils.aoa_to_sheet(aoa, { origin: `${columnOf(extractionConfiguration.startCell)}1` })
  const totalsRow = headerRow + rowCount + 1
  setCell(sheet, `U${totalsRow}`, 'Total habitat area')
  xslx.utils.book_append_sheet(workbook, sheet, extractionConfiguration.sheetName)
  return xslx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

const extractSheet = async (extractionConfiguration, buffer) => {
  const extractor = new BngMetricSingleDataExtractor()
  const response = await extractor.extractContent(Readable.from(buffer), {
    extractionConfiguration: { sheet: extractionConfiguration }
  })
  return response.sheet
}

// Enhancement tabs E-3, F-3: no structural signal of their own, so their last row is derived from
// D-3's detected totals row. D-3 is populated in the same workbook purely so that sibling lookup works.
const buildSiblingDerivedEnhancementWorkbook = (targetConfig, rowCount) => {
  const workbook = xslx.utils.book_new()
  addGateSheets(workbook)

  const d3HeaderRow = startRowOf(d3OffSiteHabitatEnhancement.startCell)
  const d3Aoa = Array.from({ length: d3HeaderRow - 1 }, () => [])
  d3Aoa.push(d3OffSiteHabitatEnhancement.cellHeaders)
  for (let i = 1; i <= rowCount; i++) {
    d3Aoa.push(d3OffSiteHabitatEnhancement.cellHeaders.map((header, idx) => (idx === 0 ? i : `v${idx}-${i}`)))
  }
  const d3Sheet = xslx.utils.aoa_to_sheet(d3Aoa, { origin: `${columnOf(d3OffSiteHabitatEnhancement.startCell)}1` })
  setCell(d3Sheet, `U${d3HeaderRow + rowCount + 1}`, 'Total habitat area')
  xslx.utils.book_append_sheet(workbook, d3Sheet, d3OffSiteHabitatEnhancement.sheetName)

  const targetHeaderRow = startRowOf(targetConfig.startCell)
  const targetAoa = Array.from({ length: targetHeaderRow - 1 }, () => [])
  targetAoa.push(targetConfig.cellHeaders)
  for (let i = 1; i <= rowCount; i++) {
    targetAoa.push(targetConfig.cellHeaders.map((header, idx) => (idx === 0 ? i : `v${idx}-${i}`)))
  }
  const targetSheet = xslx.utils.aoa_to_sheet(targetAoa, { origin: `${columnOf(targetConfig.startCell)}1` })
  xslx.utils.book_append_sheet(workbook, targetSheet, targetConfig.sheetName)

  return xslx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

// Old (v1.0.3-era) legacy row counts confirmed from the Phase 1 workbook diff
const sequentialRefCases = [
  { name: 'D-1 Off-Site Habitat Baseline', config: d1OffSiteHabitatBaseline, legacyMax: 248, build: buildBaselineWorkbook },
  { name: 'E-1 Off-Site Hedge Baseline', config: e1OffSiteHedgeBaseline, legacyMax: 248, build: buildBaselineWorkbook },
  { name: "F-1 Off-Site WaterC' Baseline", config: f1OffSiteWaterCBaseline, legacyMax: 248, build: buildBaselineWorkbook },
  { name: 'D-2 Off-Site Habitat Creation', config: d2OffSiteHabitatCreation, legacyMax: 246, build: buildCreationWorkbookRefOutsideRange },
  { name: 'E-2 Off-Site Hedge Creation', config: e2OffSiteHedgeCreation, legacyMax: 248, build: buildCreationWorkbookRefInsideRange },
  { name: "F-2 Off-Site WaterC' Creation", config: f2OffSiteWaterCCreation, legacyMax: 248, build: buildCreationWorkbookRefInsideRange }
]

describe('Phase 5 verification: rows 1, old legacy maximum and new 350 maximum per tab type', () => {
  sequentialRefCases.forEach(({ name, config, legacyMax, build }) => {
    describe(name, () => {
      it.each([1, legacyMax, 350])('reads exactly %i row(s), including rows beyond the old maximum', async rowCount => {
        const buffer = build(config, rowCount)
        const rows = await extractSheet(config, buffer)
        expect(rows.length).toEqual(rowCount)
      })

      it('produces the same output shape (same keys) for 1 row and 350 rows', async () => {
        const oneRow = await extractSheet(config, build(config, 1))
        const manyRows = await extractSheet(config, build(config, 350))
        expect(Object.keys(manyRows[0]).sort()).toEqual(Object.keys(oneRow[0]).sort())
      })
    })
  })

  describe('D-3 Off-Site Habitat Enhancment (totals-label detection)', () => {
    it.each([1, 248, 350])('reads exactly %i preceding data row(s) regardless of row count', async rowCount => {
      const buffer = buildLabelledEnhancementWorkbook(d3OffSiteHabitatEnhancement, rowCount)
      const rows = await extractSheet(d3OffSiteHabitatEnhancement, buffer)
      expect(rows.length).toEqual(rowCount)
    })
  })

  describe('E-3 and F-3 (derived from D-3 via sibling-offset detection)', () => {
    it.each([1, 248, 350])('E-3 Off-Site Hedge Enhancement reads exactly %i row(s), including rows beyond the old maximum', async rowCount => {
      const buffer = buildSiblingDerivedEnhancementWorkbook(e3OffSiteHedgeEnhancement, rowCount)
      const rows = await extractSheet(e3OffSiteHedgeEnhancement, buffer)
      expect(rows.length).toEqual(rowCount)
    })

    it.each([1, 248, 350])('F-3 Off-Site WaterC Enhancement reads exactly %i row(s), including rows beyond the old maximum', async rowCount => {
      const buffer = buildSiblingDerivedEnhancementWorkbook(f3OffSiteWaterCEnhancement, rowCount)
      const rows = await extractSheet(f3OffSiteWaterCEnhancement, buffer)
      expect(rows.length).toEqual(rowCount)
    })
  })
})

describe('Phase 5 verification: renamed sheets are out of scope for this package', () => {
  it('does not reference the renamed "Unit shortfall"/"Credits" sheets anywhere in the v4.1 configuration', () => {
    const configuredSheetNames = Object.values(configuration['v4.1']).map(config => config.sheetName)
    configuredSheetNames.forEach(sheetName => {
      expect(sheetName).not.toMatch(/unit shortfall|credits/i)
    })
  })
})

describe('Phase 5 verification: unknown or corrupted workbooks are rejected with a clear error', () => {
  it('rejects a buffer that is not a valid xlsx file at all', async () => {
    const extractor = new BngMetricSingleDataExtractor()
    const corruptBuffer = Buffer.from('this is not a spreadsheet')
    await expect(extractor.extractContent(Readable.from(corruptBuffer), {})).rejects.toBeInstanceOf(Error)
  })

  it('rejects a valid xlsx workbook missing the required metric sheets', async () => {
    const workbook = xslx.utils.book_new()
    xslx.utils.book_append_sheet(workbook, xslx.utils.aoa_to_sheet([['not', 'a', 'metric']]), 'Some Other Sheet')
    const buffer = xslx.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    const extractor = new BngMetricSingleDataExtractor()
    await expect(extractor.extractContent(Readable.from(buffer), {})).rejects.toEqual(new Error('Workbook is not a valid metric'))
  })
})
