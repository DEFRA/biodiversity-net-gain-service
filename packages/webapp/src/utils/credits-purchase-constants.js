const routes = {
  CREDITS_PURCHASE_APPLYING_INDIVIDIAL_ORGANISATION: '/credits-purchase/applying-individual-organisation',
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details'
  // REGISTER_CREDIT_PURCHASE_TASK_LIST: '/credit-purchase/register-credit-purchase-task-list'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  CREDITS_PURCHASE_APPLYING_INDIVIDIAL_ORGANISATION: 'credits-purchase-applying-individual-organisation',
  CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED: 'credits-purchase-defra-account-details-confirmed'
}

export default {
  routes,
  views,
  redisKeys
}
