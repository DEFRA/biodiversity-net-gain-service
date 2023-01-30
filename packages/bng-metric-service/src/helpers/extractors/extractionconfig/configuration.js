// start configuration
const startHeaders = ['Project details']

const startExtractionConfig = {
  sheetName: 'Start',
  titleCellAddress: 'D9',
  startCell: 'D10',
  cellHeaders: startHeaders,
  columnsToBeRemoved: ['__EMPTY']
}

// Headline result configuration
export const headlineResultExtractionConfig = {
  sheetName: 'Headline Results',
  titleCellAddress: 'B3',
  startCell: 'B7',
  cellHeaders: [],
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: 'task',
    __EMPTY_4: 'unit',
    __EMPTY_6: 'value'
  }
}
// Habitat baseline configuration
const habitatBaselineHeaders = ['Broad habitat', ' Habitat type', areaHectares, 'Distinctiveness',
  'Score', 'Condition ', 'Score', 'Condition', 'Score_1', strategicSignificance,
  'Strategic significance_1', 'Strategic Significance multiplier', 'Total habitat units',
  'Baseline units retained', 'Baseline units enhanced', 'Area lost', 'Units lost']
const habitatBaselineExtractionConfig = {
  sheetName: 'Headline Results',
  titleCellAddress: 'B3',
  startCell: 'B8',
  cellHeaders: habitatBaselineHeaders,
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: broadHabitat,
    __EMPTY_1: proposedHabitat,
    __EMPTY_3: areaHectares,
    __EMPTY_4: habitatUnitsDelivered
  }
}

export default { startExtractionConfig, habitatBaselineExtractionConfig, headlineResultExtractionConfig }
