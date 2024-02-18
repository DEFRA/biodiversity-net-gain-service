const routes = {
  CREDITS_PURCHASE_TASK_LIST: '/credits-purchase/task-list'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

export default {
  routes,
  views
}
