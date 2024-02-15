const routes = {
  APPLYING_INDIVIDIAL_ORGANISATION: '/credits-purchase/applying-individual-organisation',
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details'
  // REGISTER_CREDIT_PURCHASE_TASK_LIST: '/credit-purchase/register-credit-purchase-task-list'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  APPLYING_INDIVIDIAL_ORGANISATION: 'applying-individual-organisation',
  DEFRA_ACCOUNT_DETAILS_CONFIRMED: 'defra-account-details-confirmed'
}

export default {
  routes,
  views,
  redisKeys
}
