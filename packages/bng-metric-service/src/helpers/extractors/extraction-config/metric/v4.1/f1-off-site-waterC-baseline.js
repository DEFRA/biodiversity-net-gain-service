export const headers = {
  common: [
    'Watercourse type',
    'Length (km)',
    'Condition',
    'Total watercourse units',
    'Extent of encroachment',
    'Extent of encroachment for both banks',
    'Strategic significance'
  ],
  developer: [
    'Off-site reference'
  ],
  landowner: [
    'Baseline ref'
  ]
}

export default {
  sheetName: 'F-1 Off-Site WaterC\' Baseline',
  titleCellAddress: 'B3',
  startCell: 'C9',
  endCell: 'AG258',
  columnsToBeRemoved: [],
  substitutions: {
    'Condition ': 'Condition'
  }
}
