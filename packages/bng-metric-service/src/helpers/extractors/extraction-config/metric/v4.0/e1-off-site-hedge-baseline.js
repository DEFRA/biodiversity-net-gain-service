const headers = [
  'Hedgerow type',
  'Length (km)',
  'Condition',
  'Total hedgerow units',
  'Off-site reference'
]

const e1OffSiteHedgeBaseline = {
  sheetName: 'E-1 Off-Site Hedge Baseline',
  titleCellAddress: 'B3',
  startCell: 'B9',
  endCell: 'AB258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    'Condition ': 'Condition'
  }
}

export default e1OffSiteHedgeBaseline
