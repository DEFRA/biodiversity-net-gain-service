import landConstants from './loj-constants.js'
import developerConstants from './developer-constants.js'

const {
  routes: {
    AGENT_ACTING_FOR_CLIENT,
    CHECK_DEFRA_ACCOUNT_DETAILS,
    APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
    CLIENT_INDIVIDUAL_ORGANISATION,
    IS_ADDRESS_UK,
    CLIENTS_NAME,
    CLIENTS_ORGANISATION_NAME,
    DEFRA_ACCOUNT_NOT_LINKED,
    NON_UK_ADDRESS,
    UK_ADDRESS,
    CHECK_APPLICANT_INFORMATION,
    CLIENTS_EMAIL_ADDRESS,
    UPLOAD_WRITTEN_AUTHORISATION,
    CHECK_WRITTEN_AUTHORISATION_FILE,
    CLIENTS_PHONE_NUMBER,
    UPLOAD_LAND_OWNERSHIP,
    LAND_OWNERSHIP_PROOF_LIST,
    CHECK_PROOF_OF_OWNERSHIP,
    UPLOAD_LAND_BOUNDARY,
    CHECK_LAND_BOUNDARY_DETAILS,
    CHECK_LAND_BOUNDARY,
    ADD_HECTARES,
    CHECK_UPLOAD_METRIC,
    CHECK_HABITAT_BASELINE,
    CHECK_HABITAT_CREATED,
    UPLOAD_METRIC,
    CHECK_METRIC_DETAILS,
    LEGAL_AGREEMENT_TYPE,
    CHECK_LEGAL_AGREEMENT_DETAILS,
    UPLOAD_LOCAL_LAND_CHARGE,
    CHECK_LOCAL_LAND_CHARGE_FILE,
    REGISTER_LAND_TASK_LIST,
    ADD_GRID_REFERENCE,
    NEED_ADD_ALL_LEGAL_FILES,
    NEED_LEGAL_AGREEMENT,
    UPLOAD_LEGAL_AGREEMENT,
    CHECK_LEGAL_AGREEMENT,
    CHECK_LEGAL_AGREEMENT_FILES,
    NEED_ADD_ALL_RESPONSIBLE_BODIES,
    NEED_ADD_ALL_PLANNING_AUTHORITIES,
    ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
    CHECK_RESPONSIBLE_BODIES,
    ANY_OTHER_LANDOWNERS,
    LANDOWNER_INDIVIDUAL_ORGANISATION,
    HABITAT_PLAN_LEGAL_AGREEMENT,
    ADD_LANDOWNER_INDIVIDUAL,
    ADD_LANDOWNER_ORGANISATION,
    CHECK_LANDOWNERS,
    ENHANCEMENT_WORKS_START_DATE,
    UPLOAD_HABITAT_PLAN,
    CHECK_HABITAT_PLAN_FILE,
    HABITAT_ENHANCEMENTS_END_DATE,
    ADD_PLANNING_AUTHORITY,
    CHECK_PLANNING_AUTHORITIES,
    LAND_OWNERSHIP_REMOVE,
    CHANGE_TYPE_LEGAL_AGREEMENT,
    CHANGE_CLIENT_INDIVIDUAL_ORGANISATION,
    CHANGE_ACTING_ON_BEHALF_OF_CLIENT,
    CHANGE_APPLYING_INDIVIDUAL_ORGANISATION,
    REMOVE_LANDOWNER,
    REMOVE_RESPONSIBLE_BODY,
    REMOVE_LEGAL_AGREEMENT_FILE,
    NEED_ADD_ALL_LANDOWNERS
  }
} = landConstants

const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/upload-geospatial-file'
const CHOOSE_LAND_BOUNDARY_UPLOAD = 'land/choose-land-boundary-upload'
const CHECK_GEOSPATIAL_FILE = 'land/check-geospatial-file'

const {
  routes: {
    DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
    DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
    DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE
  }
} = developerConstants

const routes = {
  COMBINED_CASE_TASK_LIST: 'combined-case/tasklist',
  COMBINED_CASE_CHECK_AND_SUBMIT: 'combined-case/check-and-submit',
  COMBINED_CASE_UPLOAD_ALLOCATION_METRIC: 'combined-case/upload-allocation-metric',
  COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC: 'combined-case/check-allocation-metric',
  COMBINED_CASE_MATCH_AVAILABLE_HABITATS: 'combined-case/match-allocation',
  COMBINED_CASE_PROJECTS: 'combined-case/combined-case-projects',
  COMBINED_CASE_CONTINUE_PROJECT: 'combined-case/continue-combined-case-project',
  COMBINED_CASE_NEW_PROJECT: 'combined-case/new-combined-case-project',
  COMBINED_CASE_MATCH_ALLOCATION_SUMMARY: 'combined-case/match-allocation-summary',
  COMBINED_CASE_MATCH_HABITATS: 'combined-case/match-habitats',
  COMBINED_CASE_CONFIRMATION: 'combined-case/application-submitted',
  COMBINED_CASE_CHANGE_REGISTRATION_METRIC: 'combined-case/change-registration-metric'
}

const redisKeys = {
  COMBINED_CASE_REGISTRATION_METRIC_DATA: 'combined-case-registration-metric-data',
  COMBINED_CASE_ALLOCATION_METRIC_DATA: 'combined-case-allocation-metric-data',
  COMBINED_CASE_ALLOCATION_HABITATS: 'combined-case-allocation-habitats',
  COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING: 'combined-case-allocation-habitats-processing',
  COMBINED_CASE_REGISTRATION_HABITATS: 'combined-case-registration-habitats',
  COMBINED_CASE_SELECTED_HABITAT_ID: 'combined-case-selected-habitat-id',
  COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE: 'combined-case-match-available-habitats-complete',
  COMBINED_CASE_APPLICATION_SUBMITTED: 'combined-case-application-submitted',
  COMBINED_CASE_APPLICATION_REFERENCE: 'combined-case-application-reference',
  COMBINED_CASE_MATCH_HABITAT_NOT_CHECKED: 'combined-case-match-habitat-not-checked',
  COMBINED_CASE_MATCH_HABITAT_NO_MATCHES: 'combined-case-match-habitat-no-matches'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const routesToReuse = [
  `/${AGENT_ACTING_FOR_CLIENT}`,
  `/${DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION}`,
  `/${DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE}`,
  `/${DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE}`,
  `/${UPLOAD_LAND_OWNERSHIP}`,
  `/${LAND_OWNERSHIP_PROOF_LIST}`,
  `/${CHECK_PROOF_OF_OWNERSHIP}`,
  `/${UPLOAD_LAND_BOUNDARY}`,
  `/${CHECK_LAND_BOUNDARY_DETAILS}`,
  `/${CHECK_LAND_BOUNDARY}`,
  `/${ADD_HECTARES}`,
  `/${CHECK_UPLOAD_METRIC}`,
  `/${CHECK_HABITAT_BASELINE}`,
  `/${CHECK_HABITAT_CREATED}`,
  `/${UPLOAD_METRIC}`,
  `/${CHECK_METRIC_DETAILS}`,
  `/${LEGAL_AGREEMENT_TYPE}`,
  `/${CHECK_LEGAL_AGREEMENT_DETAILS}`,
  `/${UPLOAD_LOCAL_LAND_CHARGE}`,
  `/${CHECK_LOCAL_LAND_CHARGE_FILE}`,
  `/${REGISTER_LAND_TASK_LIST}`,
  `/${CHECK_DEFRA_ACCOUNT_DETAILS}`,
  `/${APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION}`,
  `/${CLIENT_INDIVIDUAL_ORGANISATION}`,
  `/${IS_ADDRESS_UK}`,
  `/${CLIENTS_NAME}`,
  `/${CLIENTS_ORGANISATION_NAME}`,
  `/${DEFRA_ACCOUNT_NOT_LINKED}`,
  `/${NON_UK_ADDRESS}`,
  `/${UK_ADDRESS}`,
  `/${CHECK_APPLICANT_INFORMATION}`,
  `/${CLIENTS_EMAIL_ADDRESS}`,
  `/${UPLOAD_WRITTEN_AUTHORISATION}`,
  `/${CHECK_WRITTEN_AUTHORISATION_FILE}`,
  `/${CLIENTS_PHONE_NUMBER}`,
  `/${ADD_GRID_REFERENCE}`,
  `/${NEED_ADD_ALL_LEGAL_FILES}`,
  `/${NEED_LEGAL_AGREEMENT}`,
  `/${UPLOAD_LEGAL_AGREEMENT}`,
  `/${CHECK_LEGAL_AGREEMENT}`,
  `/${CHECK_LEGAL_AGREEMENT_FILES}`,
  `/${NEED_ADD_ALL_RESPONSIBLE_BODIES}`,
  `/${NEED_ADD_ALL_PLANNING_AUTHORITIES}`,
  `/${ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT}`,
  `/${CHECK_RESPONSIBLE_BODIES}`,
  `/${ANY_OTHER_LANDOWNERS}`,
  `/${LANDOWNER_INDIVIDUAL_ORGANISATION}`,
  `/${HABITAT_PLAN_LEGAL_AGREEMENT}`,
  `/${ADD_LANDOWNER_INDIVIDUAL}`,
  `/${ADD_LANDOWNER_ORGANISATION}`,
  `/${CHECK_LANDOWNERS}`,
  `/${ENHANCEMENT_WORKS_START_DATE}`,
  `/${UPLOAD_HABITAT_PLAN}`,
  `/${CHECK_HABITAT_PLAN_FILE}`,
  `/${HABITAT_ENHANCEMENTS_END_DATE}`,
  `/${ADD_PLANNING_AUTHORITY}`,
  `/${CHECK_PLANNING_AUTHORITIES}`,
  `/${CHOOSE_LAND_BOUNDARY_UPLOAD}`,
  `/${UPLOAD_GEOSPATIAL_LAND_BOUNDARY}`,
  `/${LAND_OWNERSHIP_REMOVE}`,
  `/${CHECK_GEOSPATIAL_FILE}`,
  `/${CHANGE_TYPE_LEGAL_AGREEMENT}`,
  `/${CHANGE_CLIENT_INDIVIDUAL_ORGANISATION}`,
  `/${CHANGE_ACTING_ON_BEHALF_OF_CLIENT}`,
  `/${CHANGE_APPLYING_INDIVIDUAL_ORGANISATION}`,
  `/${REMOVE_LANDOWNER}`,
  `/${REMOVE_RESPONSIBLE_BODY}`,
  `/${REMOVE_LEGAL_AGREEMENT_FILE}`,
  `/${NEED_ADD_ALL_LANDOWNERS}`
]

const reusedRoutePath = (baseUrl, originalRoute) => {
  const pathParts = originalRoute.split('/')
  const page = pathParts[pathParts.length - 1]
  return `${baseUrl}/${page}`
}

const baseUrl = '/combined-case'

const reusedRoutes = {
  COMBINED_CASE_AGENT_ACTING_FOR_CLIENT: reusedRoutePath(baseUrl, AGENT_ACTING_FOR_CLIENT),
  COMBINED_CASE_DEVELOPMENT_PROJECT_INFORMATION: reusedRoutePath(baseUrl, DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION),
  COMBINED_CASE_UPLOAD_PLANNING_DECISION_NOTICE: reusedRoutePath(baseUrl, DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE),
  COMBINED_CASE_CHECK_PLANNING_DECISION_NOTICE_FILE: reusedRoutePath(baseUrl, DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE),
  COMBINED_CASE_UPLOAD_LAND_OWNERSHIP: reusedRoutePath(baseUrl, UPLOAD_LAND_OWNERSHIP),
  COMBINED_CASE_LAND_OWNERSHIP_PROOF_LIST: reusedRoutePath(baseUrl, LAND_OWNERSHIP_PROOF_LIST),
  COMBINED_CASE_CHECK_PROOF_OF_OWNERSHIP: reusedRoutePath(baseUrl, CHECK_PROOF_OF_OWNERSHIP),
  COMBINED_CASE_UPLOAD_LAND_BOUNDARY: reusedRoutePath(baseUrl, UPLOAD_LAND_BOUNDARY),
  COMBINED_CASE_CHECK_LAND_BOUNDARY_DETAILS: reusedRoutePath(baseUrl, CHECK_LAND_BOUNDARY_DETAILS),
  COMBINED_CASE_CHECK_LAND_BOUNDARY: reusedRoutePath(baseUrl, CHECK_LAND_BOUNDARY),
  COMBINED_CASE_ADD_HECTARES: reusedRoutePath(baseUrl, ADD_HECTARES),
  COMBINED_CASE_CHECK_UPLOAD_METRIC: reusedRoutePath(baseUrl, CHECK_UPLOAD_METRIC),
  COMBINED_CASE_CHECK_HABITAT_BASELINE: reusedRoutePath(baseUrl, CHECK_HABITAT_BASELINE),
  COMBINED_CASE_CHECK_HABITAT_CREATED: reusedRoutePath(baseUrl, CHECK_HABITAT_CREATED),
  COMBINED_CASE_UPLOAD_METRIC: reusedRoutePath(baseUrl, UPLOAD_METRIC),
  COMBINED_CASE_CHECK_METRIC_DETAILS: reusedRoutePath(baseUrl, CHECK_METRIC_DETAILS),
  COMBINED_CASE_LEGAL_AGREEMENT_TYPE: reusedRoutePath(baseUrl, LEGAL_AGREEMENT_TYPE),
  COMBINED_CASE_CHECK_LEGAL_AGREEMENT_DETAILS: reusedRoutePath(baseUrl, CHECK_LEGAL_AGREEMENT_DETAILS),
  COMBINED_CASE_UPLOAD_LOCAL_LAND_CHARGE: reusedRoutePath(baseUrl, UPLOAD_LOCAL_LAND_CHARGE),
  COMBINED_CASE_CHECK_LOCAL_LAND_CHARGE_FILE: reusedRoutePath(baseUrl, CHECK_LOCAL_LAND_CHARGE_FILE),
  COMBINED_CASE_CHECK_DEFRA_ACCOUNT_DETAILS: reusedRoutePath(baseUrl, CHECK_DEFRA_ACCOUNT_DETAILS),
  COMBINED_CASE_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION: reusedRoutePath(baseUrl, APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION),
  COMBINED_CASE_CLIENT_INDIVIDUAL_ORGANISATION: reusedRoutePath(baseUrl, CLIENT_INDIVIDUAL_ORGANISATION),
  COMBINED_CASE_IS_ADDRESS_UK: reusedRoutePath(baseUrl, IS_ADDRESS_UK),
  COMBINED_CASE_CLIENTS_NAME: reusedRoutePath(baseUrl, CLIENTS_NAME),
  COMBINED_CASE_CLIENTS_ORGANISATION_NAME: reusedRoutePath(baseUrl, CLIENTS_ORGANISATION_NAME),
  COMBINED_CASE_DEFRA_ACCOUNT_NOT_LINKED: reusedRoutePath(baseUrl, DEFRA_ACCOUNT_NOT_LINKED),
  COMBINED_CASE_NON_UK_ADDRESS: reusedRoutePath(baseUrl, NON_UK_ADDRESS),
  COMBINED_CASE_UK_ADDRESS: reusedRoutePath(baseUrl, UK_ADDRESS),
  COMBINED_CASE_CHECK_APPLICANT_INFORMATION: reusedRoutePath(baseUrl, CHECK_APPLICANT_INFORMATION),
  COMBINED_CASE_CLIENTS_EMAIL_ADDRESS: reusedRoutePath(baseUrl, CLIENTS_EMAIL_ADDRESS),
  COMBINED_CASE_UPLOAD_WRITTEN_AUTHORISATION: reusedRoutePath(baseUrl, UPLOAD_WRITTEN_AUTHORISATION),
  COMBINED_CASE_CHECK_WRITTEN_AUTHORISATION_FILE: reusedRoutePath(baseUrl, CHECK_WRITTEN_AUTHORISATION_FILE),
  COMBINED_CASE_CLIENTS_PHONE_NUMBER: reusedRoutePath(baseUrl, CLIENTS_PHONE_NUMBER),
  COMBINED_CASE_ADD_GRID_REFERENCE: reusedRoutePath(baseUrl, ADD_GRID_REFERENCE),
  COMBINED_CASE_NEED_ADD_ALL_LEGAL_FILES: reusedRoutePath(baseUrl, NEED_ADD_ALL_LEGAL_FILES),
  COMBINED_CASE_NEED_LEGAL_AGREEMENT: reusedRoutePath(baseUrl, NEED_LEGAL_AGREEMENT),
  COMBINED_CASE_UPLOAD_LEGAL_AGREEMENT: reusedRoutePath(baseUrl, UPLOAD_LEGAL_AGREEMENT),
  COMBINED_CASE_CHECK_LEGAL_AGREEMENT: reusedRoutePath(baseUrl, CHECK_LEGAL_AGREEMENT),
  COMBINED_CASE_CHECK_LEGAL_AGREEMENT_FILES: reusedRoutePath(baseUrl, CHECK_LEGAL_AGREEMENT_FILES),
  COMBINED_CASE_NEED_ADD_ALL_RESPONSIBLE_BODIES: reusedRoutePath(baseUrl, NEED_ADD_ALL_RESPONSIBLE_BODIES),
  COMBINED_CASE_NEED_ADD_ALL_PLANNING_AUTHORITIES: reusedRoutePath(baseUrl, NEED_ADD_ALL_PLANNING_AUTHORITIES),
  COMBINED_CASE_ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT: reusedRoutePath(baseUrl, ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT),
  COMBINED_CASE_CHECK_RESPONSIBLE_BODIES: reusedRoutePath(baseUrl, CHECK_RESPONSIBLE_BODIES),
  COMBINED_CASE_ANY_OTHER_LANDOWNERS: reusedRoutePath(baseUrl, ANY_OTHER_LANDOWNERS),
  COMBINED_CASE_LANDOWNER_INDIVIDUAL_ORGANISATION: reusedRoutePath(baseUrl, LANDOWNER_INDIVIDUAL_ORGANISATION),
  COMBINED_CASE_HABITAT_PLAN_LEGAL_AGREEMENT: reusedRoutePath(baseUrl, HABITAT_PLAN_LEGAL_AGREEMENT),
  COMBINED_CASE_ADD_LANDOWNER_INDIVIDUAL: reusedRoutePath(baseUrl, ADD_LANDOWNER_INDIVIDUAL),
  COMBINED_CASE_ADD_LANDOWNER_ORGANISATION: reusedRoutePath(baseUrl, ADD_LANDOWNER_ORGANISATION),
  COMBINED_CASE_CHECK_LANDOWNERS: reusedRoutePath(baseUrl, CHECK_LANDOWNERS),
  COMBINED_CASE_ENHANCEMENT_WORKS_START_DATE: reusedRoutePath(baseUrl, ENHANCEMENT_WORKS_START_DATE),
  COMBINED_CASE_UPLOAD_HABITAT_PLAN: reusedRoutePath(baseUrl, UPLOAD_HABITAT_PLAN),
  COMBINED_CASE_CHECK_HABITAT_PLAN_FILE: reusedRoutePath(baseUrl, CHECK_HABITAT_PLAN_FILE),
  COMBINED_CASE_HABITAT_ENHANCEMENTS_END_DATE: reusedRoutePath(baseUrl, HABITAT_ENHANCEMENTS_END_DATE),
  COMBINED_CASE_ADD_PLANNING_AUTHORITY: reusedRoutePath(baseUrl, ADD_PLANNING_AUTHORITY),
  COMBINED_CASE_CHECK_PLANNING_AUTHORITIES: reusedRoutePath(baseUrl, CHECK_PLANNING_AUTHORITIES),
  COMBINED_CASE_CHOOSE_LAND_BOUNDARY_UPLOAD: reusedRoutePath(baseUrl, CHOOSE_LAND_BOUNDARY_UPLOAD),
  COMBINED_CASE_UPLOAD_GEOSPATIAL_LAND_BOUNDARY: reusedRoutePath(baseUrl, UPLOAD_GEOSPATIAL_LAND_BOUNDARY),
  COMBINED_CASE_REGISTER_LAND_TASK_LIST: reusedRoutePath(baseUrl, REGISTER_LAND_TASK_LIST),
  COMBINED_CASE_LAND_OWNERSHIP_REMOVE: reusedRoutePath(baseUrl, LAND_OWNERSHIP_REMOVE),
  COMBINED_CASE_CHECK_GEOSPATIAL_FILE: reusedRoutePath(baseUrl, CHECK_GEOSPATIAL_FILE),
  COMBINED_CASE_CHANGE_TYPE_LEGAL_AGREEMENT: reusedRoutePath(baseUrl, CHANGE_TYPE_LEGAL_AGREEMENT),
  COMBINED_CASE_CHANGE_CLIENT_INDIVIDUAL_ORGANISATION: reusedRoutePath(baseUrl, CHANGE_CLIENT_INDIVIDUAL_ORGANISATION),
  COMBINED_CASE_CHANGE_ACTING_ON_BEHALF_OF_CLIENT: reusedRoutePath(baseUrl, CHANGE_ACTING_ON_BEHALF_OF_CLIENT),
  COMBINED_CASE_CHANGE_APPLYING_INDIVIDUAL_ORGANISATION: reusedRoutePath(baseUrl, CHANGE_APPLYING_INDIVIDUAL_ORGANISATION),
  COMBINED_CASE_REMOVE_LANDOWNER: reusedRoutePath(baseUrl, REMOVE_LANDOWNER),
  COMBINED_CASE_REMOVE_RESPONSIBLE_BODY: reusedRoutePath(baseUrl, REMOVE_RESPONSIBLE_BODY),
  COMBINED_CASE_REMOVE_LEGAL_AGREEMENT_FILE: reusedRoutePath(baseUrl, REMOVE_LEGAL_AGREEMENT_FILE),
  COMBINED_CASE_NEED_ADD_ALL_LANDOWNERS: reusedRoutePath(baseUrl, NEED_ADD_ALL_LANDOWNERS)
}

const setCombinedRefer = [
  routes.COMBINED_CASE_CHECK_AND_SUBMIT,
  reusedRoutes.COMBINED_CASE_LAND_OWNERSHIP_PROOF_LIST.replace(/^\//, ''),
  reusedRoutes.COMBINED_CASE_CHECK_LEGAL_AGREEMENT_DETAILS.replace(/^\//, ''),
  reusedRoutes.COMBINED_CASE_CHECK_LAND_BOUNDARY_DETAILS.replace(/^\//, ''),
  reusedRoutes.COMBINED_CASE_CHECK_METRIC_DETAILS.replace(/^\//, ''),
  reusedRoutes.COMBINED_CASE_CHECK_APPLICANT_INFORMATION.replace(/^\//, '')
]

const clearCombinedRefer = [
  reusedRoutes.COMBINED_CASE_UPLOAD_METRIC.replace(/^\//, ''),
  routes.COMBINED_CASE_TASK_LIST
]

export default {
  routes,
  redisKeys,
  views,
  routesToReuse,
  reusedRoutes,
  baseUrl,
  setCombinedRefer,
  clearCombinedRefer
}
