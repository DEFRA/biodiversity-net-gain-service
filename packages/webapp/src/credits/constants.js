const routes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier'
}

const views = Object.fromEntries(Object.entries(routes).map(([k, v]) => [k, v.substring(1)]))

export default {
  routes,
  views,
  redisKeys: {
    ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation'
  }
}
