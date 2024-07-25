// Routes constants
const routes = {
  COMBINED_CASE_TASK_LIST: 'combined-case/tasklist',
  COMBINED_CASE_CHECK_AND_SUBMIT: 'combined-case/check-and-submit',
  COMBINED_CASE_PROJECTS: 'combined-case/combined-case-projects',
  COMBINED_CASE_CONTINUE_PROJECT: 'combined-case/continue-combined-case-project',
  COMBINED_CASE_NEW_PROJECT: 'combined-case/new-combined-case-project',
  COMBINED_CASE_MATCH_HABITATS: 'combined-case/match-habitats'
}

const redisKeys = {
  COMBINED_CASE_REGISTRATION_METRIC_DATA: 'combined-case-registration-metric-data',
  COMBINED_CASE_ALLOCATION_METRIC_DATA: 'combined-case-allocation-metric-data',
  COMBINED_CASE_ALLOCATION_HABITATS: 'combined-case-allocation-habitats',
  COMBINED_CASE_REGISTRATION_HABITATS: 'combined-case-registration-habitats',
  COMBINED_CASE_SELECTED_HABITAT_ID: 'combined-case-selected-habitat-id'
}

export default {
  routes,
  redisKeys
}
