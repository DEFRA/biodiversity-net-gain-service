const headers = [
  'Broad habitat',
  'Proposed habitat',
  'Area (hectares)',
  'Condition',
  'Habitat created in advance (years)',
  'Delay in starting habitat creation (years)',
  'Habitat units delivered',
  'Habitat reference Number',
  'Off-site reference',
  'Strategic significance',
  'User baseline ref'
]

const d2OffSiteHabitatCreation = {
  sheetName: 'D-2 Off-Site Habitat Creation',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AG257',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    __EMPTY: 'Broad habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_6: 'Condition',
    __EMPTY_8: 'Habitat units delivered',
    'Habitat created in advance (years) ': 'Habitat created in advance (years)',
    'Habitat reference ': 'Habitat reference Number',
    'Baseline Ref': 'User baseline ref'
  }
}

export default d2OffSiteHabitatCreation
