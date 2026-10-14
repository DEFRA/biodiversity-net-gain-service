import d3OffSiteHabitatEnhancement from './d3-off-site-habitat-enhancement.js'

const headers = [
  'Baseline ref',
  'Baseline habitat',
  'Proposed habitat',
  'Length (km)',
  'Condition',
  'Habitat enhanced in advance (years)',
  'Delay in starting habitat enhancement (years)',
  'Watercourse units delivered',
  'Habitat reference Number',
  'Off-site reference',
  'Extent of encroachment',
  'Extent of encroachment for both banks',
  'Strategic significance'
]

const f3OffSiteWaterCEnhancement = {
  sheetName: 'F-3 Off-Site WaterC Enhancement',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AT',
  // No structural signal of its own; last row is derived from D-3's detected totals row (confirmed
  // exact for the legacy file from the Phase 1 workbook diff; legacyRow is the fallback if that fails)
  rowExtent: { method: 'siblingOffset', siblingSheetConfig: d3OffSiteHabitatEnhancement, offset: -1, legacyRow: 258 },
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    __EMPTY: 'Proposed habitat',
    __EMPTY_1: 'Length (km)',
    __EMPTY_3: 'Watercourse units delivered',
    'Condition ': 'Condition',
    'Habitat enhanced in advance (years) ': 'Habitat enhanced in advance (years)',
    'Habitat reference': 'Habitat reference Number',
    'Strategic significance_1': 'Strategic significance'
  }
}

export default f3OffSiteWaterCEnhancement
