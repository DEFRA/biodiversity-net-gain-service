const routes = {
  COMBINED_CASE_REGISTRATION_UPLOAD_METRIC: '/combined-case/upload-registration-metric',
  COMBINED_CASE_ALLOCATION_UPLOAD_METRIC: '/combined-case/upload-allocation-metric',
  COMBINED_CASE_CHOOSE_ALLOCATION_HABITAT: '/combined-case/choose-allocation-habitat',
  COMBINED_CASE_MATCH_REGISTRATION_HABITAT: '/combined-case/match-registration-habitat',
  COMBINED_CASE_HABITAT_SUMMARY: '/combined-case/habitat-summary'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  COMBINED_CASE_REGISTRATION_METRIC_DATA: 'combined-case-registration-metric-data',
  COMBINED_CASE_ALLOCATION_METRIC_DATA: 'combined-case-allocation-metric-data',
  COMBINED_CASE_ALLOCATION_HABITATS: 'combined-case-allocation-habitats',
  COMBINED_CASE_REGISTRATION_HABITATS: 'combined-case-registration-habitats',
  COMBINED_CASE_SELECTED_HABITAT_ID: 'combined-case-selected-habitat-id'
}

export default {
  routes,
  views,
  redisKeys,
  BLOB_STORAGE_CONTAINER: 'customer-uploads'
}
