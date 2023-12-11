import configuration from '../extraction-config/configuration.js'

const sheetConfig = configuration['v4.1']
const tolerance = 0.02
const checkEqualsWithTolerance = (total, retained, value1, value2) =>
  Math.abs((total - retained) - (value1 + value2)) < tolerance

const areOffsiteTotalsCorrect = workbook => checkEqualsWithTolerance(
  workbook.Sheets[sheetConfig.d1OffSiteHabitatBaseline.sheetName]?.H259?.v,
  workbook.Sheets[sheetConfig.d1OffSiteHabitatBaseline.sheetName]?.V259?.v || 0, // Retained value for D1
  workbook.Sheets[sheetConfig.d2OffSiteHabitatCreation.sheetName]?.G257?.v,
  workbook.Sheets[sheetConfig.d3OffSiteHabitatEnhancement.sheetName]?.V259?.v
) && checkEqualsWithTolerance(
  workbook.Sheets[sheetConfig.e1OffSiteHedgeBaseline.sheetName]?.E258?.v,
  workbook.Sheets[sheetConfig.e1OffSiteHedgeBaseline.sheetName]?.S258?.v || 0, // Retained value for E1
  workbook.Sheets[sheetConfig.e2OffSiteHedgeCreation.sheetName]?.E260?.v,
  workbook.Sheets[sheetConfig.e3OffSiteHedgeEnhancement.sheetName]?.P258?.v
) && checkEqualsWithTolerance(
  workbook.Sheets[sheetConfig.f1OffSiteWaterCBaseline.sheetName]?.E258?.v,
  workbook.Sheets[sheetConfig.f1OffSiteWaterCBaseline.sheetName]?.F258?.v || 0, // Retained value for F1
  workbook.Sheets[sheetConfig.f2OffSiteWaterCCreation.sheetName]?.D260?.v,
  workbook.Sheets[sheetConfig.f3OffSiteWaterCEnhancement.sheetName]?.Q258?.v
)

export default areOffsiteTotalsCorrect
