export const headers = {
  common: [
    'Length (km)',
    'Condition',
    'Habitat created in advance (years)',
    'Delay in starting habitat creation (years)',
    'Extent of encroachment for both banks'
  ],
  developer: [
    'Watercourse units delivered',
    'Off-site reference'
  ],
  landowner: [
    'Strategic significance',
    'Extent of encroachment'
  ]
}

export default {
  sheetName: 'F-2 Off-Site WaterC\' Creation',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AT258',
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'Watercourse units delivered',
    'Condition ': 'Condition',
    'Habitat created in advance (years) ': 'Habitat created in advance (years)',
    'Length km': 'Length (km)'
  }
}
