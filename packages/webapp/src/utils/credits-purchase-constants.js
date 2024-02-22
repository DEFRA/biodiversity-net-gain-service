const routes = {
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details',
  PURCHASE_CREDITS_INDIVIDUAL_MIDDLE_NAME: 'credits-purchase/individual-middle-name',
  PURCHASE_CREDITS_INDIVIDUAL_DOB: 'credits-purchase/individual-dob',
  PURCHASE_CREDITS_INDIVIDUAL_NATIONALITY: 'credits-purchase/individual-nationality',
  PURCHASE_CREDITS_INDIVIDUAL_ORG: 'credits-purchase/applying-individual-organisation'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED: 'credits-purchase-defra-account-details-confirmed',
  PURCHASE_CREDITS_INDIVIDUAL_MIDDLE_NAME: 'credits_purchase_individual_middle_name',
  PURCHASE_CREDITS_INDIVIDUAL_DOB: 'credits_purchase_individual_dob',
  PURCHASE_CREDITS_INDIVIDUAL_NATIONALITY: 'credits_purchase_individual_nationality'
}

export default {
  routes,
  views,
  redisKeys
}
