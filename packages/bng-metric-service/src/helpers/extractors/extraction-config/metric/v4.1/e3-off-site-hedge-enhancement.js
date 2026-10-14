import d3OffSiteHabitatEnhancement from './d3-off-site-habitat-enhancement.js'

const headers = [
  'Baseline ref',
  'Baseline habitat',
  'Proposed habitat',
  'Length (km)',
  'Condition',
  'Habitat enhanced in advance (years)',
  'Delay in starting habitat enhancement (years)',
  'Hedge units delivered',
  'Habitat reference Number',
  'Off-site reference',
  'Distinctiveness',
  'Strategic significance'
]

const e3OffSiteHedgeEnhancement = {
  sheetName: 'E-3 Off-Site Hedge Enhancement',
  titleCellAddress: 'B3',
  startCell: 'B11',
  endCell: 'AO',
  // No structural signal of its own; last row is derived from D-3's detected totals row (confirmed
  // exact for the legacy file from the Phase 1 workbook diff; legacyRow is the fallback if that fails)
  rowExtent: { method: 'siblingOffset', siblingSheetConfig: d3OffSiteHabitatEnhancement, offset: -1, legacyRow: 258 },
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    __EMPTY: 'Proposed habitat',
    __EMPTY_1: 'Length (km)',
    __EMPTY_4: 'Hedge units delivered',
    'Condition ': 'Condition',
    'Habitat enhanced in advance (years) ': 'Habitat enhanced in advance (years)',
    'Habitat reference': 'Habitat reference Number'
  }
}

export default e3OffSiteHedgeEnhancement
