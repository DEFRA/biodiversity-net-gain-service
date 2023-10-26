import creditConstants from './credit-constants.js'

const CREDITS_ESTIMATION_PATH = '/credits-estimation'
const routes = {
  ...creditConstants.routes,
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier'
}

const views = Object.fromEntries(Object.entries(routes).map(([k, v]) => [k, v.substring(1)]))

export default {
  ...creditConstants.routes,
  CREDITS_ESTIMATION_PATH,
  routes,
  views,
  ...creditConstants.uploadTypes,
  redisKeys: {
    ...creditConstants.redisKeys,
    ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation'
  }
}
