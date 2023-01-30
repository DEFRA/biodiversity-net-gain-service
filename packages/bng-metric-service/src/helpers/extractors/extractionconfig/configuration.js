// start configuration
const startHeaders = ['Project details']
const broadHabitat = 'Broad Habitat'
const proposedHabitat = 'Proposed habitat'
const areaHectares = 'Area (hectares)'
const habitatUnitsDelivered = 'Habitat units delivered'
const strategicSignificance = 'Strategic significance'

const startExtractionConfig = {
  sheetName: 'Start',
  titleCellAddress: 'D9',
  startCell: 'D10',
  cellHeaders: startHeaders,
  columnsToBeRemoved: ['__EMPTY']
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

export default { startExtractionConfig, habitatBaselineExtractionConfig }
