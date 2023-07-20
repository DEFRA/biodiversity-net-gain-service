export const headers = {
  common: [
    'Hedgerow type',
    'Length (km)',
    'Condition',
    'Total hedgerow units',
    'Strategic significance'
  ],
  developer: [
    'Hedge number',
    'Off-site reference'
  ],
  landowner: [
    'Baseline ref'
  ]
}

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
