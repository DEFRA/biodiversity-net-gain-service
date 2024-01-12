const baselineRef = 'Baseline ref'
const totalUnits = 'Total hedgerow units'

const headers = [
  baselineRef,
  totalUnits,
  'Hedgerow type',
  'Length (km)',
  'Length enhanced',
  'Condition',
  'Habitat reference Number',
  'Off-site reference',
  'Hedge number',
  'Strategic significance'
]

const e1OffSiteHedgeBaseline = {
  sheetName: 'E-1 Off-Site Hedge Baseline',
  titleCellAddress: 'B3',
  startCell: 'B9',
  endCell: 'AB258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [[baselineRef, totalUnits]],
  substitutions: {
    'Condition ': 'Condition',
    'Habitat reference': 'Habitat reference Number'
  }
}

export default e1OffSiteHedgeBaseline
