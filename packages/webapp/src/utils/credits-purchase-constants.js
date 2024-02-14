// Routes constants
const routes = {
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details',
  CREDITS_APPLICATION_LIST: 'credits-purchase/credits-application-list',
  CREDITS_TASKLIST: 'credits-purchase/credits-tasklist'
}
// ./Routes constants

// Views constants
const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)
// ./Views constants

// RedisKeys constants
const redisKeys = {
  CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED: 'credits-purchase-defra-account-details-confirmed',
  CREDITS_PURCHASE_USER_TYPE: 'credits-user-type'
}
// ./RedisKeys constants

export default {
  routes,
  views,
  redisKeys
}
