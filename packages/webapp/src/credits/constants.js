const CREDITS_ESTIMATION_PATH = '/credits-estimation'

const routes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier',
  CREDITS_TIER: '/credits/credits-tier',
  CREDITS_COST: '/credits/credits-cost'
}

const views = Object.fromEntries(Object.entries(routes).map(([k, v]) => [k, v.substring(1)]))

export default {
  CREDITS_ESTIMATION_PATH,
  routes,
  views,
  redisKeys: {
    ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation',
    CREDITS_CALCULATION: 'credits-calculation'
  }
}
