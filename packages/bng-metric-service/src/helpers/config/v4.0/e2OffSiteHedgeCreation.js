const cellHeaders = [
  'Habitat type',
  'Length (km)',
  'Condition',
  'Habitat created in advance/years',
  'Delay in starting habitat creation/years',
  'Hedge units delivered'
]

export default {
  sheetName: 'E-2 Off-Site Hedge Creation',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AA260',
  columnsToCheckNull: '',
  cellHeaders
}
