const baselineRef = 'Baseline ref'
const totalUnits = 'Total habitat units'

const headers = [
  baselineRef,
  totalUnits,
  'Broad habitat',
  'Habitat type',
  'Area (hectares)',
  'Area enhanced',
  'Condition',
  'Off-site reference',
  'Strategic significance'
]

const d1OffSiteHabitatBaseline = {
  sheetName: 'D-1 Off-Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AF259',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [[baselineRef, totalUnits]],
  substitutions: {
    'Condition ': 'Condition'
  }
}

export default d1OffSiteHabitatBaseline
