const headers = [
  'Watercourse type',
  'Length (km)',
  'Condition',
  'Total watercourse units',
  'Off-site reference',
  'Extent of encroachment',
  'Extent of encroachment for both banks',
  'Strategic significance'
]

const f1OffSiteWaterCBaseline = {
  sheetName: 'F-1 Off-Site WaterC\' Baseline',
  titleCellAddress: 'B3',
  startCell: 'C9',
  endCell: 'AG258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    'Condition ': 'Condition'
  }
}

export default f1OffSiteWaterCBaseline
