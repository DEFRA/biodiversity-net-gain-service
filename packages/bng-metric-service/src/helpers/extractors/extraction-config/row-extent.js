import xslx from 'xlsx'

const rowFromCellAddress = cellAddress => parseInt(cellAddress.match(/\d+/)[0], 10)
const columnFromCellAddress = cellAddress => cellAddress.match(/[A-Z]+/)[0]

// Scans a hidden/visible sequential row-number column (1, 2, 3, ...) to find the row
// immediately after the last sequential value, i.e. the totals row.
const findSequentialTotalsRow = (worksheet, { refColumn, startCell, maxSearchRows = 1000 }) => {
  const firstDataRow = rowFromCellAddress(startCell) + 1
  const firstValue = worksheet[`${refColumn}${firstDataRow}`]?.v
  const secondValue = worksheet[`${refColumn}${firstDataRow + 1}`]?.v

  // Sanity check: the column must actually start a 1, 2, ... sequence before we trust it
  if (firstValue !== 1 || secondValue !== 2) {
    return null
  }

  let row = firstDataRow
  let expected = 1
  while (row < firstDataRow + maxSearchRows && worksheet[`${refColumn}${row}`]?.v === expected) {
    row += 1
    expected += 1
  }

  return row
}

// Sheets without a sequential row-number column (e.g. enhancement tabs) are scanned for the
// first cell whose text contains "total", within the sheet's own configured column range.
const findLabelledTotalsRow = (worksheet, { startCell, endCell, maxSearchRows = 1000 }) => {
  const startRow = rowFromCellAddress(startCell) + 1
  const startCol = xslx.utils.decode_col(columnFromCellAddress(startCell))
  const endCol = xslx.utils.decode_col(columnFromCellAddress(endCell))

  for (let row = startRow; row < startRow + maxSearchRows; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const value = worksheet[`${xslx.utils.encode_col(col)}${row}`]?.v
      if (typeof value === 'string' && /total/i.test(value)) {
        return row
      }
    }
  }

  return null
}

// Resolves the totals row for a sheet using its configured rowExtent metadata, falling back
// to the sheet's legacy (hard-coded) totals row if the structure cannot be detected.
const detectTotalsRow = (worksheet, extractionConfiguration) => {
  const { rowExtent, startCell, endCell } = extractionConfiguration
  if (!rowExtent) {
    return null
  }

  if (rowExtent.method === 'sequentialRefColumn') {
    return findSequentialTotalsRow(worksheet, { refColumn: rowExtent.refColumn, startCell })
  }

  if (rowExtent.method === 'totalsLabel') {
    return findLabelledTotalsRow(worksheet, { startCell, endCell })
  }

  return null
}

// Sheets with no structural signal of their own (e.g. E-3, F-3) derive their last row from a sibling
// sheet's detected totals row plus a fixed offset confirmed from the same release's workbook evidence.
const resolveSiblingDerivedRow = (workbook, extractionConfiguration) => {
  const { siblingSheetConfig, offset } = extractionConfiguration.rowExtent
  const siblingWorksheet = workbook.Sheets[siblingSheetConfig.sheetName]
  if (!siblingWorksheet) {
    return null
  }

  const siblingRow = detectTotalsRow(siblingWorksheet, siblingSheetConfig)
  return siblingRow ? siblingRow + offset : null
}

// Sheets with no label or ref column (E-3, F-3) still total their column with a SUM() formula; the
// sibling offset to D-3 differs between layouts, so the formula's own position is the reliable signal.
const findSumFormulaTotalsRow = (worksheet, { column, startCell, maxSearchRows = 1000 }) => {
  const startRow = rowFromCellAddress(startCell) + 1
  for (let row = startRow; row < startRow + maxSearchRows; row++) {
    if (/^SUM\(/i.test(worksheet[`${column}${row}`]?.f || '')) {
      return row
    }
  }

  return null
}

export { findSequentialTotalsRow, findLabelledTotalsRow, detectTotalsRow, resolveSiblingDerivedRow, findSumFormulaTotalsRow }
