const routes = {
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details',
  ESTIMATOR_CREDITS_INDIVIDUAL_ORG: '/credits-purchase/applying-individual-organisation',
  CREDITS_TERM_AND_CONDITIONS: '/credits-purchase/credits-terms-and-conditions',
  CREDITS_CHECK_YOUR_ANSWERS: '/credits-purchase/credits-check-your-answers'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED: 'credits-purchase-defra-account-details-confirmed'
}

export default {
  routes,
  views,
  redisKeys
}
