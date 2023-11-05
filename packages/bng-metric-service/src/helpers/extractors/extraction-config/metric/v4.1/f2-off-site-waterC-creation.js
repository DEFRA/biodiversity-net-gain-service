const headers = [
  'Watercourse type',
  'Length (km)',
  'Condition',
  'Habitat created in advance (years)',
  'Delay in starting habitat creation (years)',
  'Watercourse units delivered',
  'Habitat reference number',
  'Off-site reference',
  'Extent of encroachment for both banks',
  'Extent of encroachment',
  'Strategic significance'
]

const f2OffSiteWaterCCreation = {
  sheetName: 'F-2 Off-Site WaterC\' Creation',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AH260',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'Watercourse units delivered',
    'Condition ': 'Condition',
    'Habitat created in advance (years) ': 'Habitat created in advance (years)',
    'Length km': 'Length (km)'
  }
}

export default f2OffSiteWaterCCreation
