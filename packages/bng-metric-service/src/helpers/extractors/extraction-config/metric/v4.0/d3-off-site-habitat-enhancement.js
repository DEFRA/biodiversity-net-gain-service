export const headers = {
  common: [
    'Proposed Broad Habitat',
    'Proposed habitat',
    'Area (hectares)',
    'Condition',
    'Habitat enhanced in advance (years)',
    'Delay in starting habitat enhancement (years)'
  ],
  developer: [
    'Baseline habitat',
    'Total habitat area',
    'Distinctiveness change',
    'Condition change',
    'Off-site reference',
    'Habitat units delivered'
  ],
  landowner: [
    'Strategic significance',
    'Baseline ref'
  ]
}

export default {
  sheetName: 'D-3 Off-Site Habitat Enhancment',
  titleCellAddress: 'E3',
  startCell: 'E11',
  endCell: 'AU259',
  columnsToBeRemoved: [],
  columnsToBeExtracted: {
    'Strategic significance': 1
  },
  substitutions: {
    __EMPTY: 'Area (hectares)',
    __EMPTY_3: 'Condition',
    __EMPTY_5: 'Habitat units delivered',
    'Habitat enhanced in advance (years) ': 'Habitat enhanced in advance (years)',
    'Proposed Habitat': 'Proposed habitat',
    ' Distinctiveness change': 'Distinctiveness change'
  }
}
