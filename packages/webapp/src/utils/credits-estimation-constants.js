const CREDITS_ESTIMATION_PATH = '/credits-estimation'

const routes = {
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier',
  ESTIMATOR_CREDITS_CYA: '/credits-estimation/credits-check-your-answers',
  ESTIMATOR_CREDITS_CONFIRMATION: '/credits-estimation/credits-confirmation'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation',
  CREDITS_APP_REFERENCE: 'credits-application-reference'
}

export default {
  CREDITS_ESTIMATION_PATH,
  routes,
  views,
  redisKeys
}
