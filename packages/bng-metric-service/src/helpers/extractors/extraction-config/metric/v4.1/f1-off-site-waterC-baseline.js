const baselineRef = 'Baseline ref'
const totalUnits = 'Total watercourse units'

const headers = [
  baselineRef,
  totalUnits,
  'Watercourse type',
  'Length (km)',
  'Length enhanced',
  'Condition',
  'Total watercourse units',
  'Habitat reference Number',
  'Off-site reference',
  'Extent of encroachment',
  'Extent of encroachment for both banks',
  'Strategic significance'
]

const f1OffSiteWaterCBaseline = {
  sheetName: 'F-1 Off-Site WaterC\' Baseline',
  titleCellAddress: 'B3',
  startCell: 'C9',
  endCell: 'AH258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [[baselineRef, totalUnits]],
  substitutions: {
    'Condition ': 'Condition',
    'Habitat reference': 'Habitat reference Number'
  }
}

export default f1OffSiteWaterCBaseline
