import areOffsiteTotalsCorrect from '../validation-config/are-offsite-totals-correct.js'
import configuration from '../extraction-config/configuration.js'

const sheetConfig = configuration['v4.1']

// Populates a sequential ref column for rowCount rows and places the totals value at the row
// immediately after the sequence, i.e. where dynamic row-extent detection should find it.
const buildSequentialSheet = (refColumn, firstDataRow, rowCount, totalsColumn, totalsValue) => {
  const sheet = {}
  for (let i = 0; i < rowCount; i++) {
    sheet[`${refColumn}${firstDataRow + i}`] = { v: i + 1 }
  }
  sheet[`${totalsColumn}${firstDataRow + rowCount}`] = { v: totalsValue }
  return sheet
}

const buildWorkbook = ({ d1, d2, d3, e1, e2, e3, f1, f2, f3 }) => ({
  Sheets: {
    [sheetConfig.d1OffSiteHabitatBaseline.sheetName]: buildSequentialSheet('D', 11, 350, 'H', d1),
    [sheetConfig.d2OffSiteHabitatCreation.sheetName]: buildSequentialSheet('B', 11, 350, 'G', d2),
    [sheetConfig.d3OffSiteHabitatEnhancement.sheetName]: { U362: { v: 'Total habitat area' }, V362: { v: d3 } },
    [sheetConfig.e1OffSiteHedgeBaseline.sheetName]: buildSequentialSheet('B', 10, 350, 'E', e1),
    [sheetConfig.e2OffSiteHedgeCreation.sheetName]: buildSequentialSheet('B', 12, 350, 'E', e2),
    [sheetConfig.e3OffSiteHedgeEnhancement.sheetName]: { P362: { v: e3, f: 'SUM(P12:P361)' }, P258: { v: 12345 } },
    [sheetConfig.f1OffSiteWaterCBaseline.sheetName]: buildSequentialSheet('C', 10, 350, 'E', f1),
    [sheetConfig.f2OffSiteWaterCCreation.sheetName]: buildSequentialSheet('B', 12, 350, 'D', f2),
    [sheetConfig.f3OffSiteWaterCEnhancement.sheetName]: { Q362: { v: f3, f: 'SUM(Q12:Q361)' }, Q258: { v: 12345 } }
  }
})

describe('areOffsiteTotalsCorrect with a 350-row workbook', () => {
  it('reads totals from the row-extent-detected rows and returns true when they balance', () => {
    const workbook = buildWorkbook({ d1: 10, d2: 4, d3: 6, e1: 9, e2: 4, e3: 5, f1: 8, f2: 3, f3: 5 })

    expect(areOffsiteTotalsCorrect(workbook)).toBe(true)
  })

  it('returns false when a detected total does not balance', () => {
    const workbook = buildWorkbook({ d1: 10, d2: 4, d3: 7, e1: 9, e2: 4, e3: 5, f1: 8, f2: 3, f3: 5 })

    expect(areOffsiteTotalsCorrect(workbook)).toBe(false)
  })

  it('returns false when only the E-3 total is wrong, proving it is read from the SUM-formula row', () => {
    const workbook = buildWorkbook({ d1: 10, d2: 4, d3: 6, e1: 9, e2: 4, e3: 99, f1: 8, f2: 3, f3: 5 })

    expect(areOffsiteTotalsCorrect(workbook)).toBe(false)
  })

  it('reads E-3/F-3 totals from the legacy row 258 for a v1.0.3 layout', () => {
    const workbook = buildWorkbook({ d1: 10, d2: 4, d3: 6, e1: 9, e2: 4, e3: 5, f1: 8, f2: 3, f3: 5 })
    workbook.Sheets[sheetConfig.e3OffSiteHedgeEnhancement.sheetName] = { P258: { v: 5, f: 'SUM(P12:P257)' } }
    workbook.Sheets[sheetConfig.f3OffSiteWaterCEnhancement.sheetName] = { Q258: { v: 5, f: 'SUM(Q12:Q257)' } }

    expect(areOffsiteTotalsCorrect(workbook)).toBe(true)
  })
})
