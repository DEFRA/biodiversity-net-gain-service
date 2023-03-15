const headers = [
  'Watercourse type',
  'Length (km)',
  'Condition',
  'Total watercourse units'
]

const f1OffSiteWaterCBaseline = {
  sheetName: 'F-1 Off-Site WaterC\' Baseline',
  titleCellAddress: 'B3',
  startCell: 'C9',
  endCell: 'AA258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    'Condition ': 'Condition'
  }
}

export default f1OffSiteWaterCBaseline
