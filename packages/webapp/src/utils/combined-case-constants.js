// Routes constants

const routes = {
  COMBINED_CASE_TASK_LIST: '/combined-case/tasklist'
}
const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)
export default {
  routes,
  views
}
