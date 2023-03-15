const headers = [
  'Baseline habitat',
  'Proposed habitat',
  'Length (km)',
  'Condition',
  'Habitat enhanced in advance (years)',
  'Delay in starting habitat enhancement (years)',
  'Watercourse units delivered'
]

const f3OffSiteWaterCEnhancement = {
  sheetName: 'F-3 Off-Site WaterC Enhancement',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AQ258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'Proposed habitat',
    __EMPTY_1: 'Length (km)',
    __EMPTY_3: 'Watercourse units delivered',
    'Condition ': 'Condition',
    'Habitat enhanced in advance (years) ': 'Habitat enhanced in advance (years)'
  }
}

export default f3OffSiteWaterCEnhancement
