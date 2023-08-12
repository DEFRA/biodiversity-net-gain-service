const routes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier'
}

export default {
  routes,
  views: Object.fromEntries(Object.entries(routes).map(([k, v]) => [k, v.substring(1)])),
  redisKeys: {
    ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation'
  }
}
