const headers = [
  'Baseline habitat',
  'Proposed habitat',
  'Length (km)',
  'Condition',
  'Habitat enhanced in advance/years',
  'Delay in starting habitat enhancement/years',
  'River units delivered'
]

const f3OffSiteRiverEnhancement = {
  sheetName: 'F-3 Off Site River Enhancement',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AQ258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'Proposed habitat',
    __EMPTY_2: 'River units delivered',
    'Condition ': 'Condition',
    'Habitat enhanced in advance/years ': 'Habitat enhanced in advance/years',
    'Length KM': 'Length (km)'
  }
}

export default f3OffSiteRiverEnhancement
