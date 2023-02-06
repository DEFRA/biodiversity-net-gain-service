import headers from './metric-file-headers.js'

// start configuration
const startExtractionConfig = {
  sheetName: 'Start',
  titleCellAddress: 'D9',
  startCell: 'D10',
  cellHeaders: headers.startHeaders,
}

// D-1 Off-Site Habitat Baseline configuration
const offSiteHabitatBaselineExtractionConfig = {
  sheetName: 'D-1 Off-Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  endCell: 'AF12',
  cellHeaders: headers.offSiteHabitatBaselineHeaders
}

export default { startExtractionConfig, offSiteHabitatBaselineExtractionConfig }
