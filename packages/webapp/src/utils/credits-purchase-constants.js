const routes = {
  CREDITS_PURCHASE_TASK_LIST: '/credits-purchase/buy-statutory-biodiversity-credits',
  CREDITS_PURCHASE_APPLICATION_LIST: '/credits-purchase/check-statutory-biodiversity-credits',
  CREDITS_PURCHASE_NEW_PURCHASE: '/credits-purchase/new-purchase',
  CREDITS_PURCHASE_CONTINUE_PURCHASE: '/credits-purchase/continue-purchase'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

export default {
  routes,
  views
}
