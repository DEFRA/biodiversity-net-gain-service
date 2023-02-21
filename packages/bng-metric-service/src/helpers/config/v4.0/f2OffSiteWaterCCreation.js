const headers = [
  'River type',
  'Length (km)',
  'Condition',
  'Habitat created in advance/years',
  'Delay in starting habitat creation/years',
  'River units delivered'
]

const f2OffSiteWaterCCreation = {
  sheetName: 'F-2 Off-Site Water\'C Creation',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AD260',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'River units delivered',
    'Condition ': 'Condition',
    'Habitat created in advance/years ': 'Habitat created in advance/years',
    'Length km': 'Length (km)'
  }
}

export default f2OffSiteWaterCCreation
