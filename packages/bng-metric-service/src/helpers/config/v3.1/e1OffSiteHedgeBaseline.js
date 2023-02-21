const headers = [
  'Hedgerow type',
  'Length (km)',
  'Condition',
  'Total hedgerow units'
]

const e1OffSiteHedgeBaseline = {
  sheetName: 'E-1 Off Site Hedge Baseline',
  titleCellAddress: 'B3',
  startCell: 'B9',
  endCell: 'W258',
  cellHeaders: headers,
  columnsToCheckNull: 'Distinctiveness'
}

export default e1OffSiteHedgeBaseline
