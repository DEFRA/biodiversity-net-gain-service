const routes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier',
  ESTIMATOR_CREDITS_TERM_AND_CONDITIONS: '/credits-estimation/credits-terms-and-conditions',
  ESTIMATOR_CREDITS_CHECK_YOUR_ANSWERS: '/credits-estimation/credits-check-your-answers'
}

const views = Object.fromEntries(Object.entries(routes).map(([k, v]) => [k, v.substring(1)]))

export default {
  routes,
  views,
  redisKeys: {
    ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation',
    CREDITS_TERMS_AND_CONDITIONS: 'estimator-credits-consent'
  }
}
