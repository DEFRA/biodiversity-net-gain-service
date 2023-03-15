import configuration from '../extraction-config/configuration.js'
const sheetConfig = configuration['v4.0']

const areOffsiteTotalsCorrect = workbook => {
  return (
    workbook.Sheets[sheetConfig.d1OffSiteHabitatBaseline.sheetName]?.H259?.v ===
    workbook.Sheets[sheetConfig.d2OffSiteHabitatCreation.sheetName]?.G257?.v +
    workbook.Sheets[sheetConfig.d3OffSiteHabitatEnhancement.sheetName]?.V259?.v
  ) && (
    workbook.Sheets[sheetConfig.e1OffSiteHedgeBaseline.sheetName]?.E258?.v ===
      workbook.Sheets[sheetConfig.e2OffSiteHedgeCreation.sheetName]?.E260?.v +
      workbook.Sheets[sheetConfig.e3OffSiteHedgeEnhancement.sheetName]?.P258?.v
  ) && (
    workbook.Sheets[sheetConfig.f1OffSiteWaterCBaseline.sheetName]?.E258?.v ===
      workbook.Sheets[sheetConfig.f2OffSiteWaterCCreation.sheetName]?.D260?.v +
      workbook.Sheets[sheetConfig.f3OffSiteWaterCEnhancement.sheetName]?.Q258?.v
  )
}

export default areOffsiteTotalsCorrect
