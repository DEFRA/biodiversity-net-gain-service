export const headers = {
  common: [
    'Broad habitat',
    'Habitat type',
    'Area (hectares)',
    'Condition',
    'Total habitat units',
    'Strategic significance'
  ],
  developer: [
    'Off-site reference'
  ],
  landowner: []
}

export default {
  sheetName: 'D-1 Off-Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AF259',
  columnsToBeRemoved: [],
  substitutions: {
    'Condition ': 'Condition'
  }
}
