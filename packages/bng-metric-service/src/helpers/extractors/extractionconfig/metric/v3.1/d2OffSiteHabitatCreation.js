const headers = [
  'Broad Habitat',
  'Proposed habitat',
  'Area (hectares)',
  'Condition',
  'Habitat created in advance/years',
  'Delay in starting habitat creation/years',
  'Habitat units delivered'
]

const d2OffSiteHabitatCreation = {
  sheetName: 'D-2 Off Site Habitat Creation',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AC257',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'Broad Habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_6: 'Condition ',
    __EMPTY_8: 'Habitat units delivered',
    'Condition ': 'Condition',
    'Habitat created in advance/years ': 'Habitat created in advance/years'
  }
}

export default d2OffSiteHabitatCreation
