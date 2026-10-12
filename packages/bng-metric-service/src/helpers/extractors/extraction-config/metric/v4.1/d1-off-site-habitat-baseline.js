const baselineRef = 'Ref'
const totalUnits = 'Total habitat units'

const headers = [
  baselineRef,
  totalUnits,
  'Broad habitat',
  'Habitat type',
  'Area (hectares)',
  'Area enhanced',
  'Condition',
  'Habitat reference Number',
  'Off-site reference',
  'Strategic significance'
]

const d1OffSiteHabitatBaseline = {
  sheetName: 'D-1 Off-Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AF259',
  // Hidden sequential row-number column used to find the real last data row, confirmed from the workbook structure
  rowExtent: { method: 'sequentialRefColumn', refColumn: 'D' },
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [[baselineRef, totalUnits]],
  substitutions: {
    'Condition ': 'Condition',
    'Habitat reference ': 'Habitat reference Number'
  }
}

export default d1OffSiteHabitatBaseline
