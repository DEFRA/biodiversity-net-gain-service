export const headers = {
  common: [
    'Habitat type',
    'Length (km)',
    'Condition',
    'Habitat created in advance (years)',
    'Delay in starting habitat creation (years)'
  ],
  developer: [
    'Hedge units delivered',
    'Off-site reference'
  ],
  landowner: [
    'Strategic significance'
  ]
}

export default {
  sheetName: 'E-2 Off-Site Hedge Creation',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AD260',
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'Hedge units delivered',
    'Condition ': 'Condition',
    'Habitat created in advance (years) ': 'Habitat created in advance (years)'
  }
}
