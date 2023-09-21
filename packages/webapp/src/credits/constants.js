const CREDITS_ESTIMATION_PATH = '/credits-estimation'

const routes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier',
  ESTIMATOR_CREDITS_PURCHASE_ORDER: '/credits-estimation/credits-purchase-order'
}

const views = Object.fromEntries(Object.entries(routes).map(([k, v]) => [k, v.substring(1)]))

export default {
  CREDITS_ESTIMATION_PATH,
  routes,
  views,
  redisKeys: {
    ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation',
    CREDITS_PURCHASE_ORDER_NUMBER: 'credits-purchase-order-number',
    WILL_CREDITS_PO_IN_USE: 'will-credits-po-in-use'
  }
}
