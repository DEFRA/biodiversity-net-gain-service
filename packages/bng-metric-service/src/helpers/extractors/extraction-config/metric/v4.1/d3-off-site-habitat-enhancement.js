const headers = [
  'Baseline ref',
  'Baseline habitat',
  'Proposed Broad Habitat',
  'Proposed habitat',
  'Area (hectares)',
  'Condition',
  'Habitat enhanced in advance (years)',
  'Delay in starting habitat enhancement (years)',
  'Habitat units delivered',
  'Total habitat area',
  'Distinctiveness change',
  'Condition change',
  'Habitat reference Number',
  'Off-site reference',
  'Strategic significance'
]

const d3OffSiteHabitatEnhancement = {
  sheetName: 'D-3 Off-Site Habitat Enhancment',
  titleCellAddress: 'E3',
  startCell: 'E11',
  endCell: 'AU259',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    __EMPTY: 'Area (hectares)',
    __EMPTY_3: 'Condition',
    __EMPTY_5: 'Habitat units delivered',
    'Habitat enhanced in advance (years) ': 'Habitat enhanced in advance (years)',
    'Proposed Habitat': 'Proposed habitat',
    ' Distinctiveness change': 'Distinctiveness change',
    'Habitat reference ': 'Habitat reference Number'
  }
}

export default d3OffSiteHabitatEnhancement
