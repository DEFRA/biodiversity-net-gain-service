import { findSequentialTotalsRow, findLabelledTotalsRow, detectTotalsRow } from '../row-extent.js'

const buildSequentialWorksheet = (refColumn, startRow, rowCount) => {
  const worksheet = {}
  for (let i = 0; i < rowCount; i++) {
    worksheet[`${refColumn}${startRow + i}`] = { v: i + 1 }
  }
  return worksheet
}

describe('findSequentialTotalsRow', () => {
  it('detects the totals row for 250 sequential rows (legacy row count)', () => {
    const worksheet = buildSequentialWorksheet('D', 11, 250)
    const result = findSequentialTotalsRow(worksheet, { refColumn: 'D', startCell: 'D10' })
    expect(result).toEqual(261)
  })

  it('detects the totals row for 350 sequential rows (new row count), beyond the old maximum', () => {
    const worksheet = buildSequentialWorksheet('D', 11, 350)
    const result = findSequentialTotalsRow(worksheet, { refColumn: 'D', startCell: 'D10' })
    expect(result).toEqual(361)
  })

  it('returns null for a single data row, since the sequence cannot be confirmed', () => {
    const worksheet = buildSequentialWorksheet('D', 11, 1)
    const result = findSequentialTotalsRow(worksheet, { refColumn: 'D', startCell: 'D10' })
    expect(result).toBeNull()
  })

  it('returns null when the column does not start a 1, 2, ... sequence', () => {
    const worksheet = { D11: { v: 'Not a number' }, D12: { v: 2 } }
    const result = findSequentialTotalsRow(worksheet, { refColumn: 'D', startCell: 'D10' })
    expect(result).toBeNull()
  })
})

describe('findLabelledTotalsRow', () => {
  it('finds a totals row identified by a label within the configured column range', () => {
    const worksheet = { U259: { v: 'Total habitat area' } }
    const result = findLabelledTotalsRow(worksheet, { startCell: 'E11', endCell: 'AU259' })
    expect(result).toEqual(259)
  })

  it('returns null when no totals label exists within the search window', () => {
    const worksheet = { U300: { v: 'Total habitat area' } }
    const result = findLabelledTotalsRow(worksheet, { startCell: 'E11', endCell: 'AU259', maxSearchRows: 20 })
    expect(result).toBeNull()
  })

  it('ignores a label outside the configured column range', () => {
    const worksheet = { BZ259: { v: 'Total habitat area' } }
    const result = findLabelledTotalsRow(worksheet, { startCell: 'E11', endCell: 'AU259' })
    expect(result).toBeNull()
  })
})

describe('detectTotalsRow', () => {
  it('dispatches to the sequential ref column method', () => {
    const worksheet = buildSequentialWorksheet('D', 11, 350)
    const result = detectTotalsRow(worksheet, { rowExtent: { method: 'sequentialRefColumn', refColumn: 'D' }, startCell: 'D10' })
    expect(result).toEqual(361)
  })

  it('dispatches to the totals-label method', () => {
    const worksheet = { U259: { v: 'Total habitat area' } }
    const result = detectTotalsRow(worksheet, { rowExtent: { method: 'totalsLabel' }, startCell: 'E11', endCell: 'AU259' })
    expect(result).toEqual(259)
  })

  it('returns null when no rowExtent configuration is present', () => {
    const result = detectTotalsRow({}, { startCell: 'D10', endCell: 'AF259' })
    expect(result).toBeNull()
  })

  it('returns null for an unknown detection method', () => {
    const result = detectTotalsRow({}, { rowExtent: { method: 'unknown' }, startCell: 'D10' })
    expect(result).toBeNull()
  })
})
