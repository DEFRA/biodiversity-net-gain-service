const headers = [
  'Habitat type',
  'Length (km)',
  'Condition',
  'Habitat created in advance (years)',
  'Delay in starting habitat creation (years)',
  'Hedge units delivered',
  'Off-site reference'
]

const e2OffSiteHedgeCreation = {
  sheetName: 'E-2 Off-Site Hedge Creation',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AA260',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'Hedge units delivered',
    'Condition ': 'Condition',
    'Habitat created in advance (years) ': 'Habitat created in advance (years)'
  }
}

export default e2OffSiteHedgeCreation
