// Routes constants

const routes = {
  COMBINED_CASE_TASK_LIST: 'combined-case/tasklist',
  COMBINED_CASE_CHECK_AND_SUBMIT: 'combined-case/check-and-submit',
  COMBINED_CASE_UPLOAD_ALLOCATION_METRIC: 'combined-case/upload-allocation-metric',
  COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC: 'combined-case/check-allocation-metric'
}
const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)
export default {
  routes,
  views
}
