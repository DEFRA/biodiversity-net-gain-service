const CREDITS_ESTIMATION_PATH = '/credits-estimation'

const creditEstimateRoutes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier'
}

const views = Object.fromEntries(
  Object.entries(creditEstimateRoutes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation'
}

export default {
  CREDITS_ESTIMATION_PATH,
  creditEstimateRoutes,
  views,
  redisKeys
}
