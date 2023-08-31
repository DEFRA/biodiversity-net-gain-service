export const headers = {
  common: [
    'Broad habitat',
    'Proposed habitat',
    'Area (hectares)',
    'Condition',
    'Habitat created in advance (years)',
    'Delay in starting habitat creation (years)',
    'Habitat units delivered'
  ],
  developer: [
    'Off-site reference'
  ],
  landowner: [
    'Strategic significance',
    'Off-site reference',
    'Habitat reference ',
    'Baseline Ref'
  ]
}

export default {
  sheetName: 'D-2 Off-Site Habitat Creation',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AG256',
  columnsToBeRemoved: [],
  substitutions: {
    __EMPTY: 'Broad habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_6: 'Condition',
    __EMPTY_8: 'Habitat units delivered',
    'Habitat created in advance (years) ': 'Habitat created in advance (years)'
  }
}
