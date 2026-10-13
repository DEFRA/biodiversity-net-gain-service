import configuration from '../extraction-config/configuration.js'
import { detectTotalsRow, findSumFormulaTotalsRow } from '../extraction-config/row-extent.js'

const sheetConfig = configuration['v4.1']
const tolerance = 0.00000001
const checkEqualsWithTolerance = (total, value1, value2) => Math.abs((value1 + value2) - total) < tolerance

// Resolves a totals cell using the sheet's row-extent detection when available, falling back to the legacy row
const resolveTotalsCell = (workbook, extractionConfiguration, column, legacyRow) => {
  const worksheet = workbook.Sheets[extractionConfiguration.sheetName]
  if (!worksheet) {
    return undefined
  }
  const detectedRow = extractionConfiguration.rowExtent?.method === 'siblingOffset'
    ? findSumFormulaTotalsRow(worksheet, { column, startCell: extractionConfiguration.startCell })
    : detectTotalsRow(worksheet, extractionConfiguration)
  const row = detectedRow || legacyRow
  return worksheet[`${column}${row}`]?.v
}

const areOffsiteTotalsCorrect = workbook => checkEqualsWithTolerance(
  resolveTotalsCell(workbook, sheetConfig.d1OffSiteHabitatBaseline, 'H', 259),
  resolveTotalsCell(workbook, sheetConfig.d2OffSiteHabitatCreation, 'G', 257),
  resolveTotalsCell(workbook, sheetConfig.d3OffSiteHabitatEnhancement, 'V', 259)
) && checkEqualsWithTolerance(
  resolveTotalsCell(workbook, sheetConfig.e1OffSiteHedgeBaseline, 'E', 258),
  resolveTotalsCell(workbook, sheetConfig.e2OffSiteHedgeCreation, 'E', 260),
  resolveTotalsCell(workbook, sheetConfig.e3OffSiteHedgeEnhancement, 'P', 258)
) && checkEqualsWithTolerance(
  resolveTotalsCell(workbook, sheetConfig.f1OffSiteWaterCBaseline, 'E', 258),
  resolveTotalsCell(workbook, sheetConfig.f2OffSiteWaterCCreation, 'D', 260),
  resolveTotalsCell(workbook, sheetConfig.f3OffSiteWaterCEnhancement, 'Q', 258)
)

export default areOffsiteTotalsCorrect
