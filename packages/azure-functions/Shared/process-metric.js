const processMetric = metricData => ({
  startPage: metricData.start,
  d1: metricData.d1OffSiteHabitatBaseline,
  d2: metricData.d2OffSiteHabitatCreation,
  d3: metricData.d3OffSiteHabitatEnhancement,
  e1: metricData.e1OffSiteHedgeBaseline,
  e2: metricData.e2OffSiteHedgeCreation,
  e3: metricData.e3OffSiteHedgeEnhancement,
  f1: metricData.f1OffSiteWaterCBaseline,
  f2: metricData.f2OffSiteWaterCCreation,
  f3: metricData.f3OffSiteWaterCEnhancement,
  validation: metricData.validation
})

export default processMetric
