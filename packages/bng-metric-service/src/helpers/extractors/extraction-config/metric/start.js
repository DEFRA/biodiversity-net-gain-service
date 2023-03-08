// start configuration
const startHeaders = ['Project details']

const start = {
  sheetName: 'Start',
  titleCellAddress: 'D9',
  startCell: 'A1',
  endCell: 'K66',
  cellHeaders: startHeaders,
  columnsToBeRemoved: [],
  // array of cells to pull directly from worksheet
  cells: [{
    cell: 'D8',
    name: 'version'
  }]
}

export default start
