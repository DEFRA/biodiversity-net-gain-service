const headers = [
  'River type',
  'Length (km)',
  'Condition',
  'Total river units'
]

const f1OffSiteRiverBaseline = {
  sheetName: 'F-1 Off Site River Baseline',
  titleCellAddress: 'B3',
  startCell: 'C9',
  endCell: 'AA258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    'Condition ': 'Condition',
    'length KM': 'Length (km)'
  }
}

export default f1OffSiteRiverBaseline
