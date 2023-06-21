const headers = [
  'Broad habitat',
  'Habitat type',
  'Area (hectares)',
  'Condition',
  'Total habitat units',
  'Off-site reference',
  'Strategic significance'
]

const d1OffSiteHabitatBaseline = {
  sheetName: 'D-1 Off-Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AF259',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  substitutions: {
    'Condition ': 'Condition'
  }
}

export default d1OffSiteHabitatBaseline
