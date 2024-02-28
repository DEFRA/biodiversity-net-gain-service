// Routes constants
const routes = {
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details',
  CREDITS_PURCHASE_APPLICATION_LIST: '/credits-purchase/credits-application-list',
  CREDITS_PURCHASE_TASKLIST: '/credits-purchase/credits-tasklist',
  CREDITS_PURCHASE_MIDDLE_NAME: '/credits-purchase/middle-name',
  CREDITS_PURCHASE_DATE_OF_BIRTH: '/credits-purchase/date-of-birth',
  CREDITS_PURCHASE_NATIONALITY: '/credits-purchase/nationality',
  CREDITS_PURCHASE_TERMS_AND_CONDITIONS: '/credits-purchase/confirm-terms-conditions',
  CREDITS_PURCHASE_CHECK_YOUR_ANSWERS: '/credits-purchase/credits-check-your-answers',
  CREDITS_PURCHASE_CREDITS_SELECTION: '/credits-purchase/add-statutory-biodiversity-credits',
  CREDITS_PURCHASE_CREDITS_COST: '/credits-purchase/estimated-cost-statutory-biodiversity-credits',
  CREDITS_PURCHASE_TASK_LIST: '/credits-purchase/buy-statutory-biodiversity-credits',
  CREDITS_PURCHASE_CHECK_ORDER: '/credits-purchase/check-purchase-order',
  CREDITS_PURCHASE_APP_BY_INDIVIDUAL_OR_ORGANISATION: '/credits-purchase/applying-individual-organisation'
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
  CREDITS_PURCHASE_MIDDLE_NAME: 'credits-purchase-middle-name',
  CREDITS_PURCHASE_DATE_OF_BIRTH: 'credits-purchase-date-of-birth',
  CREDITS_PURCHASE_NATIONALITY: 'credits-purchase-nationality-key',
  CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED: 'credits-purchase-consent',
  CREDITS_PURCHASE_COST_CALCULATION: 'credits-purchase-cost-calculation',
  CREDITS_PURCHASE_USER_TYPE: 'credits-purchase-user-type',
  CREDITS_PURCHASE_WILL_PO_IN_USE: 'credits-purchase-will-po-in-use',
  CREDITS_PURCHASE_ORDER_NUMBER: 'credits-purchase-order-number'
}
// ./RedisKeys constants

export default {
  routes,
  views,
  redisKeys
}
