const headers = [
  'Baseline ref',
  'Baseline habitat',
  'Proposed habitat',
  'Length (km)',
  'Condition',
  'Habitat enhanced in advance (years)',
  'Delay in starting habitat enhancement (years)',
  'Hedge units delivered',
  'Habitat reference',
  'Off-site reference',
  'Distinctiveness',
  'Strategic significance'
]

const e3OffSiteHedgeEnhancement = {
  sheetName: 'E-3 Off-Site Hedge Enhancement',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AO258',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    __EMPTY: 'Proposed habitat',
    __EMPTY_1: 'Length (km)',
    __EMPTY_4: 'Hedge units delivered',
    'Condition ': 'Condition',
    'Habitat enhanced in advance (years) ': 'Habitat enhanced in advance (years)'
  }
}

export default e3OffSiteHedgeEnhancement
