const headers = [
  'Habitat type',
  'Length (km)',
  'Condition',
  'Habitat created in advance (years)',
  'Delay in starting habitat creation (years)',
  'Hedge units delivered',
  'Habitat reference Number',
  'Off-site reference',
  'Strategic significance'
]

const e2OffSiteHedgeCreation = {
  sheetName: 'E-2 Off-Site Hedge Creation',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AE260',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    __EMPTY: 'Hedge units delivered',
    'Condition ': 'Condition',
    'Habitat created in advance (years) ': 'Habitat created in advance (years)',
    'Habitat reference ': 'Habitat reference Number'
  }
}

export default e2OffSiteHedgeCreation
