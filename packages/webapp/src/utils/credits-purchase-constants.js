const routes = {
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details',
  CREDITS_PURCHASE_INDIVIDUAL_ORG: '/credits-purchase/applying-individual-organisation',
  CREDITS_PURCHASE_TERMS_AND_CONDITIONS: '/credits-purchase/confirm-terms-conditions',
  CREDITS_PURCHASE_CHECK_YOUR_ANSWERS: '/credits-purchase/credits-check-your-answers'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED: 'credits-purchase-defra-account-details-confirmed',
  CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED: 'credits-purchase-consent'
}

export default {
  routes,
  views,
  redisKeys
}
