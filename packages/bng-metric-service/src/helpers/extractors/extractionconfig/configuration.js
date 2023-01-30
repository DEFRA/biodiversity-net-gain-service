// start configuration
const startHeaders = ['Project details']

const startExtractionConfig = {
  sheetName: 'Start',
  titleCellAddress: 'D9',
  startCell: 'D10',
  cellHeaders: startHeaders,
  columnsToBeRemoved: ['__EMPTY']
}

export default { startExtractionConfig }
