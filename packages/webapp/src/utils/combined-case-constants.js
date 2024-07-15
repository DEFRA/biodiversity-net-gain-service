// Routes constants
const routes = {
  COMBINED_CASE_TASK_LIST: 'combined-case/tasklist',
  COMBINED_CASE_CHECK_AND_SUBMIT: 'combined-case/check-and-submit',
  COMBINED_CASE_PROJECTS: 'combined-case/combined-case-projects',
  COMBINED_CASE_CONTINUE_PROJECT: 'combined-case/continue-combined-case-project',
  COMBINED_CASE_NEW_PROJECT: 'combined-case/new-combined-case-project'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

export default {
  routes,
  views
}
