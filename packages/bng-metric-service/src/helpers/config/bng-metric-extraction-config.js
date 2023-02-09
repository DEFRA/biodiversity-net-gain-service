import headers from './metric-file-headers.js'

// start configuration
const startExtractionConfig = {
  sheetName: 'Start',
  titleCellAddress: 'D9',
  startCell: 'D10',
  cellHeaders: headers.startHeaders
}

// D-1 Off-Site Habitat Baseline configuration
const offSiteHabitatBaselineExtractionConfig = {
  sheetName: 'D-1 Off-Site Habitat Baseline',
  titleCellAddress: 'D3',
  startCell: 'D10',
  cellHeaders: headers.offSiteHabitatBaselineHeaders,
  requiredField: 'Broad habitat'
}

// E-1 Off-Site Hedge Baseline configuration
const offSiteHedgeBaselineExtractionConfig = {
  sheetName: 'E-1 Off-Site Hedge Baseline',
  titleCellAddress: 'B3',
  startCell: 'B9',
  cellHeaders: headers.offSiteHedgeBaselineHeaders,
  requiredField: 'Distinctiveness'
}

export default { startExtractionConfig, offSiteHabitatBaselineExtractionConfig, offSiteHedgeBaselineExtractionConfig }
