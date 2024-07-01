import configuration from '../extraction-config/configuration.js'

const sheetConfig = configuration['v4.1']

const isDraftVersion = (workbook) => {
  // We are checking if the cell D10 in the sheet D-1 Off-Site Habitat Baseline is equal to 'Baseline ref'
  // because this is an indicator that the workbook is a draft version
  const cellValue = workbook.Sheets[sheetConfig.d1OffSiteHabitatBaseline.sheetName]?.D10?.v
  return cellValue === 'Baseline ref'
}

export default isDraftVersion
