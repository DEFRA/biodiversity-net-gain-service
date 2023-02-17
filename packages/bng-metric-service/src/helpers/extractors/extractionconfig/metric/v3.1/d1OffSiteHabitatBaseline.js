const headers = [
  'Broad habitat',
  'Habitat type',
  'Area (hectares)',
  'Condition',
  'Total habitat units'
]

const d1OffSiteHabitatBaseline = {
  sheetName: 'D-1 Off Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AA259',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    'Condition ': 'Condition'
  }
}

export default d1OffSiteHabitatBaseline
