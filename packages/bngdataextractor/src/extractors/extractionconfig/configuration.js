// start configuration
const startHeaders = ['Project details']
export const startExtractionConfig = {
  sheetName: 'Start',
  titleCellAddress: 'D9',
  startCell: 'D10',
  cellHeaders: startHeaders,
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: 'Broad Habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_4: 'Habitat units delivered'
  }
}
// Habitat baseline configuration
const habitatBaselineHeaders = ['Broad habitat', ' Habitat type', 'Area (hectares)', 'Distinctiveness',
  'Score', 'Condition ', 'Score', 'Condition', 'Score_1', 'Strategic significance',
  'Strategic significance_1', 'Strategic Significance multiplier', 'Total habitat units',
  'Baseline units retained', 'Baseline units enhanced', 'Area lost', 'Units lost']
export const habitatBaselineExtractionConfig = {
  sheetName: 'A-1 Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  cellHeaders: habitatBaselineHeaders,
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: 'Broad Habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_4: 'Habitat units delivered'
  }
}
// Habitat creation configuration
const habitatCreationHeaders = ['Broad Habitat', 'Proposed habitat', 'Area (hectares)', 'Distinctiveness', 'Score', 'Condition',
  'Strategic significance', 'Strategic position multiplier', 'Standard time to target condition/years',
  'Standard or adjusted time to target condition', 'Final time to target condition/years', 'Final time to target multiplier',
  'Standard difficulty of creation ', 'Applied difficulty multiplier', 'Final difficulty of creation ',
  'Difficulty multiplier applied']
export const habitatCreationExtractionConfig = {
  sheetName: 'A-2 Site Habitat Creation',
  titleCellAddress: 'D3',
  startCell: 'D10',
  cellHeaders: habitatCreationHeaders,
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: 'Broad Habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_4: 'Habitat units delivered'
  }
}
// Off site habitat configuration
const offSiteHabitatBaselineHeaders = ['Broad habitat', 'Habitat type', 'Area (hectares)', 'Distinctiveness', 'Score', 'Condition', 'Strategic significance',
  'Strategic position multiplier', 'Total habitat units', 'Baseline units retained', 'Baseline units enhanced', 'Area lost',
  'Units lost', 'Broad Habitat']
export const offSiteHabitatBaselineExtractionConfig = {
  sheetName: 'D-1 Off Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  cellHeaders: offSiteHabitatBaselineHeaders,
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: 'Broad Habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_4: 'Habitat units delivered'
  }
}
// D-2 Off Site Habitat Creation configuration
// TODO not all headers are coming through
const offSiteHabitatCreationHeaders = ['Broad Habitat', 'Proposed habitat', 'Area (hectares)']
export const offSiteHabitatCreationExtractionConfig = {
  sheetName: 'D-2 Off Site Habitat Creation',
  titleCellAddress: 'D3',
  startCell: 'D10',
  cellHeaders: offSiteHabitatCreationHeaders,
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: 'Broad Habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_4: 'Habitat units delivered'
  }
}
// G-5 Enhancement Temporal configuration
const enhancementTemporalHeaders = ['Start cond', 'Lower Distinctiveness Habitat', 'Lower Distinctiveness Habitat_1', 'Lower Distinctiveness Habitat_2',
  'Lower Distinctiveness Habitat_3', 'Lower Distinctiveness Habitat_4', 'Lower Distinctiveness Habitat_5', 'Lower Distinctiveness Habitat_6',
  'Poor', 'Poor_1', 'Poor_2', 'Poor_3', 'Fairly Poor_1', 'Fairly Poor_2', 'Moderate', 'Moderate_1', 'Fairly Good', 'Good']
export const enhancementTemporalExtractionConfig = {
  sheetName: 'G-5 Enhancement Temporal',
  titleCellAddress: 'E3',
  startCell: 'C2',
  cellHeaders: enhancementTemporalHeaders,
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: 'Broad Habitat',
    __EMPTY_1: 'Proposed habitat',
    __EMPTY_3: 'Area (hectares)',
    __EMPTY_4: 'Habitat units delivered'
  }
}
// Habitat groups configuration
export const habitatGroupExtractionConfig = {
  sheetName: 'G-2 Habitat groups',
  titleCellAddress: ['A1', 'AJ1', 'AU1'],
  startCells: ['A2', 'AJ3', 'AU4'],
  cellHeaders: {
    A1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
      '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
      '30', '31', '32'],
    AJ1: ['On Site Habitat Group', 'Existing Area', 'Existing Value', 'Proposed Area On Site', 'Proposed Value On Site',
      'On Site Area Change', 'On Site  Unit Change'],
    AU1: ['Habitat Group', 'Group', 'Existing Area', 'Existing Value Lost', 'Proposed Area On Site', 'Proposed Value On Site',
      'On Site Area Change', 'On Site  Unit Change', 'Proposed Area Off Site', 'Offsite Unit Change', 'unit change including offsite',
      'units required offsite', 'area lost']
  },
  columnsToBeRemoved: {
    A1: ['__EMPTY'],
    AJ1: ['__EMPTY'],
    AU1: ['__EMPTY']
  },
  substitutions: {
    A1: {
      __EMPTY: 'Broad Habitat',
      __EMPTY_1: 'Proposed habitat',
      __EMPTY_3: 'Area (hectares)',
      __EMPTY_4: 'Habitat units delivered'
    },
    AJ1: {
      __EMPTY: 'Broad Habitat',
      __EMPTY_1: 'Proposed habitat',
      __EMPTY_3: 'Area (hectares)',
      __EMPTY_4: 'Habitat units delivered'
    },
    AU1: {
      __EMPTY: 'Broad Habitat',
      __EMPTY_1: 'Proposed habitat',
      __EMPTY_3: 'Area (hectares)',
      __EMPTY_4: 'Habitat units delivered'
    }
  }
}
// off site habitat configuration
// TODO Area has not pulled correctly -- may need to test with different files
export const offSiteHabitatEnhancementExtractionConfig = {
  cellHeaders: ['Baseline habitat', 'Total habitat area', 'Baseline distinctiveness band', 'Baseline distinctiveness score',
    'Baseline condition category', 'Baseline condition score', 'Baseline strategic significance category',
    'Baseline strategic significance score', 'Baseline habitat units', 'Suggested action to address habitat losses',
    'Conditional Data Validation', 'Proposed Broad Habitat', 'Proposed Habitat', 'Proposed habitat    (Pre-Populated but can be overridden)',
    ' Distinctiveness change', 'Condition change', 'Strategic significance', 'Strategic significance_1', 'Strategic position multiplier',
    'Standard time to target condition/years', 'Standard or adjusted time to target condition', 'Final time to target condition/years',
    'Final time to target multiplier', 'Difficulty of enhancement category', 'Applied difficullty multiplier', 'Difficulty',
    'Difficulty multiplier applied', 'Spatial risk category', 'Spatial risk multiplier', 'Proposed habitat', 'Area (hectares)',
    'Habitat units delivered', 'Distinctiveness', 'Score', 'Condition', 'Score_1'],
  sheetName: 'D-3 Off Site Habitat Enhancment',
  titleCellAddress: 'E3',
  startCell: 'E11',
  columnsToBeRemoved: ['__EMPTY'],
  substitutions: {
    __EMPTY: 'Broad Habitat',
    __EMPTY_1: 'Distinctiveness',
    __EMPTY_2: 'Score',
    __EMPTY_3: 'Condition',
    __EMPTY_4: 'Score_1'
  }
}
