// Routes constants
const routes = {
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details',
  CREDITS_PURCHASE_CONFIRMATION: '/credits-purchase/credits-confirmation',
  CREDITS_PURCHASE_INDIVIDUAL_ORG: '/credits-purchase/applying-individual-organisation',
  CREDITS_PURCHASE_TERMS_AND_CONDITIONS: '/credits-purchase/confirm-terms-conditions',
  CREDITS_PURCHASE_CHECK_YOUR_ANSWERS: '/credits-purchase/credits-check-your-answers',
  CREDITS_PURCHASE_CREDITS_SELECTION: '/credits-purchase/add-statutory-biodiversity-credits',
  CREDITS_PURCHASE_CREDITS_COST: '/credits-purchase/estimated-cost-statutory-biodiversity-credits'
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
  CREDITS_PURCHASE_APPLICATION_REFERENCE: 'credits-purchase-application-reference',
  CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED: 'credits-purchase-consent',
  CREDITS_PURCHASE_COST_CALCULATION: 'credits-purchase-cost-calculation'
}
// ./RedisKeys constants

// Other constants

// ./Other constants

export default {
  routes,
  views,
  redisKeys
}
