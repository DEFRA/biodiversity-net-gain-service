const CREDITS_ESTIMATION_PATH = '/credits-estimation'

const routes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier',
  ESTIMATOR_CREDITS_PURCHASE_ORDER: '/credits-estimation/credits-purchase-order'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation'
}

export default {
  CREDITS_ESTIMATION_PATH,
  routes,
  views,
  redisKeys
}
