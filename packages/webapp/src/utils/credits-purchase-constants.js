const routes = {
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details',
  CREDITS_PURCHASE_MIDDLE_NAME: '/credits-purchase/middle-name',
  CREDITS_PURCHASE_DATE_OF_BIRTH: '/credits-purchase/date-of-birth',
  CREDITS_PURCHASE_NATIONALITY: '/credits-purchase/nationality',
  CREDITS_PURCHASE_CREDITS_SELECTION: '/credits-purchase/add-statutory-biodiversity-credits',
  CREDITS_PURCHASE_CREDITS_COST: '/credits-purchase/estimated-cost-statutory-biodiversity-credits',
  CREDITS_PURCHASE_TASK_LIST: '/credits-purchase/buy-statutory-biodiversity-credits'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED: 'credits-purchase-defra-account-details-confirmed',
  CREDITS_PURCHASE_MIDDLE_NAME: 'credits-purchase-middle-name',
  CREDITS_PURCHASE_DATE_OF_BIRTH: 'credits-purchase-date-of-birth',
  CREDITS_PURCHASE_NATIONALITY: 'credits-purchase-nationality-key',
  CREDITS_PURCHASE_COST_CALCULATION: 'credits-purchase-cost-calculation'
}

export default {
  routes,
  views,
  redisKeys
}
