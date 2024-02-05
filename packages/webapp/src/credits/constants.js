const CREDITS_ESTIMATION_PATH = '/credits-estimation'

const creditEstimateRoutes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier'
}

const mainCreditRoutes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost'
}

const routes = { ...creditEstimateRoutes, ...mainCreditRoutes }

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

export default {
  CREDITS_ESTIMATION_PATH,
  creditEstimateRoutes,
  mainCreditRoutes,
  views,
  redisKeys: {
    ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation'
  }
}
