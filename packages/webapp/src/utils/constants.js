const ABOUT = 'about'
const ADD_GRID_REFERENCE = 'land/add-grid-reference'
const ADD_HECTARES = 'land/add-hectares'
const GAIN_SITE_REFERENCE = 'gain-site-reference'
const CHECK_LEGAL_AGREEMENT = 'land/check-legal-agreement-file'
const LEGAL_AGREEMENT_TYPE = 'land/legal-agreement-type'
const LEGAL_AGREEMENT_FILE_OPTION = 'legal-agreement-file-option'
const ADD_LEGAL_AGREEMENT_PARTIES = 'land/add-legal-agreement-parties'
const LEGAL_AGREEMENT_START_DATE = 'land/legal-agreement-start-date'
const CHECK_MANAGEMENT_PLAN = 'land/check-management-plan-file'
const REGISTRATION_SUBMITTED = 'registration-submitted'
const CHECK_AND_SUBMIT = 'land/check-and-submit'
const CHECK_GEOSPATIAL_FILE = 'land/check-geospatial-file'
const DOCUMENT_UPLOAD = 'documentUpload'
const DOWNLOAD_LEGAL_AGREEMENT = 'land/download-legal-agreement-file'
const DOWNLOAD_MANAGEMENT_PLAN = 'land/download-management-plan-file'
const DOWNLOAD_LAND_BOUNDARY = 'land/download-land-boundary-file'
const DOWNLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/download-geospatial-land-boundary-file'
const DOWNLOAD_METRIC_FILE = 'land/download-metric-file'
const METRIC_UPLOAD_KEY = 'metric-upload-key'
const DOWNLOAD_LAND_OWNERSHIP = 'land/download-land-ownership-file'
const ERROR = 'error'
const GEOSPATIAL_DATA = 'geospatialData'
const GEOSPATIAL_LAND_BOUNDARY = 'land/geospatial-land-boundary'
const GEOSPATIAL_UPLOAD_LOCATION = 'geospatial-location'
const ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION = 'original-geospatial-upload-location'
const GEOSPATIAL_MAP_CONFIG = 'geospatial-map-config'
const LAND_BOUNDARY_MAP_CONFIG = 'land-boundary-map-config'
const GEOSPATIAL_FILE_NAME = 'geospatial_filename'
const GEOSPATIAL_FILE_SIZE = 'geospatial-file-size'
const GEOSPATIAL_FILE_TYPE = 'geospatial-file-type'
const GEOSPATIAL_HECTARES = 'geospatial-hectares'
const GEOSPATIAL_GRID_REFERENCE = 'geospatial-grid-reference'
const CHOOSE_LAND_BOUNDARY_UPLOAD = 'land/choose-land-boundary-upload'
const GEOSPATIAL_UPLOAD_TYPE = 'geospatial-land-boundary'
const GRID_REFERENCE_REGEX = /^([STNHOstnho][A-Za-z]\s?)(\d{5}\s?\d{5}|\d{4}\s?\d{4}|\d{3}\s?\d{3}|\d{2}\s?\d{2}|\d{1}\s?\d{1})$/
const LEGAL_AGREEMENT_CHECKED = 'legal-agreement-checked'
const LEGAL_AGREEMENT_FILE_SIZE = 'legal-agreement-file-size'
const LEGAL_AGREEMENT_FILE_TYPE = 'legal-agreement-file-type'
const LEGAL_AGREEMENT_LOCATION = 'legal-agreement-location'
const LEGAL_AGREEMENT_DOCUMENT_TYPE = 'legal-agreement-type'
const LEGAL_AGREEMENT_UPLOAD_TYPE = 'legal-agreement'
const LEGAL_AGREEMENT_PARTIES = 'legal-agreement-parties'
const LEGAL_AGREEMENT_PARTIES_KEY = 'legal-agreement-parties-key'
const MANAGEMENT_PLAN_KEY = 'management-plan-key'
const MANAGEMENT_PLAN_CHECKED = 'management-plan-checked'
const MANAGEMENT_PLAN_FILE_SIZE = 'management-plan-file-size'
const MANAGEMENT_PLAN_FILE_TYPE = 'management-plan-file-type'
const MANAGEMENT_PLAN_LOCATION = 'management-plan-location'
const MANAGEMENT_PLAN_UPLOAD_TYPE = 'management-plan'
const CHECK_PROOF_OF_OWNERSHIP = 'land/check-ownership-proof-file'
const LAND_OWNERSHIP_FILE_SIZE = 'land-ownership-file-size'
const LAND_OWNERSHIP_LOCATION = 'land-ownership-location'
const LAND_OWNERSHIP_UPLOAD_TYPE = 'land-ownership'
const LAND_OWNERSHIP_CHECKED = 'land-ownership-checked'
const LAND_OWNERSHIP_FILE_TYPE = 'land-ownership-file-type'
const NO = 'no'
const NO_AGAIN = 'noAgain'
const OS_API_TOKEN = 'land/os-api-token'
const PUBLIC_ROUTES = 'public-routes'
const SESSION = 'session'
const START = 'start'
const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/upload-geospatial-file'
const UPLOAD_MANAGEMENT_PLAN = 'land/upload-management-plan'
const UPLOAD_LEGAL_AGREEMENT = 'land/upload-legal-agreement'
const CHECK_LEGAL_AGREEMENT_DETAILS = 'land/check-legal-agreement-details'
const UPLOAD_LAND_BOUNDARY = 'land/upload-land-boundary'
const UPLOAD_LAND_OWNERSHIP = 'land/upload-ownership-proof'
const LAND_BOUNDARY_CHECKED = 'land-boundary-checked'
const METRIC_FILE_CHECKED = 'metric-file-checked'
const LEGAL_AGREEMENT_START_DATE_KEY = 'legal-agreement-start-date'
const LEGAL_AGREEMENT_ORGANISATION_NAMES = 'legal-agreement-oganisation-names'
const LEGAL_AGREEMENT_OTHER_PARTY_NAMES = 'legal-agreement-other-party-names'
const LEGAL_AGREEMENT_START_DAY = 'legal-agreement-start-day'
const LEGAL_AGREEMENT_START_MONTH = 'legal-agreement-start-month'
const LEGAL_AGREEMENT_START_YEAR = 'legal-agreement-start-year'
const LEGAL_AGREEMENT_ORGANISATION_NAMES_CHECKED = 'legal-agreement-oganisation-checked'
const LAND_BOUNDARY_FILE_SIZE = 'land-boundary-file-size'
const LAND_BOUNDARY_FILE_TYPE = 'land-boundary-file-type'
const LAND_BOUNDARY_LOCATION = 'land-boundary-location'
const LAND_BOUNDARY_UPLOAD_TYPE = 'land-boundary'
const LAND_BOUNDARY_GRID_REFERENCE = 'land-boundary-grid-reference'
const LAND_BOUNDARY_HECTARES = 'land-boundary-hectares'
const CHECK_LAND_BOUNDARY = 'land/check-land-boundary-file'
const UPLOAD_METRIC = 'land/upload-metric'
const CHECK_UPLOAD_METRIC = 'land/check-metric-file'
const METRIC_UPLOADED_ANSWER = 'check-uploaded-metric'
const METRIC_LOCATION = 'metric-file-location'
const METRIC_FILE_SIZE = 'metric-file-size'
const METRIC_FILE_TYPE = 'metric-file-type'
const METRIC_UPLOAD_TYPE = 'metric-upload'
const HOME = 'home'
const NAME = 'land/name'
const NAME_KEY = 'name-key'
const FULL_NAME = 'fullname'
const ROLE = 'land/role'
const ROLE_KEY = 'role'
const ROLE_OTHER = 'role-other'
const CHECK_YOUR_DETAILS = 'land/check-your-details'
const REGISTER_LAND_TASK_LIST = 'land/register-land-task-list'
const HABITAT_WORKS_START_DATE = 'land/habitat-works-start-date'
const HABITAT_WORKS_START_DATE_KEY = 'habitat-works-start-date'
const MANAGEMENT_MONITORING_START_DATE = 'land/management-monitoring-start-date'
const MANAGEMENT_MONITORING_START_DATE_KEY = 'management-monitoring-start-date'
const CHECK_MANAGEMENT_MONITORING_DETAILS = 'land/check-management-monitoring-details'
const REGISTERED_LANDOWNER = 'land/registered-landowner'
const REGISTERED_LANDOWNER_ONLY = 'registered-landowner-only'
const ADD_LANDOWNERS = 'land/add-landowners'
const LANDOWNERS = 'landowners'
const LANDOWNER_CONSENT = 'land/landowner-consent'
const LANDOWNER_CONSENT_KEY = 'landowner-consent'
const CHECK_OWNERSHIP_DETAILS = 'land/check-ownership-details'
const LAND_OWNERSHIP_KEY = 'land-ownership-key'
const CHECK_LAND_BOUNDARY_DETAILS = 'land/check-land-boundary-details'
const REGISTRATION_TASK_DETAILS = 'registrationTaskDetails'
const DEFAULT_REGISTRATION_TASK_STATUS = 'NOT STARTED'
const COMPLETE_REGISTRATION_TASK_STATUS = 'COMPLETED'
const NEED_BOUNDARY_FILE = 'land/need-boundary-file'
const NEED_OWNERSHIP_PROOF = 'land/need-ownership-proof'
const NEED_METRIC = 'land/need-metric'
const NEED_MANAGEMENT_PLAN = 'land/need-management-plan'
const NEED_LEGAL_AGREEMENT = 'land/need-legal-agreement'
const REFERER = 'referer'
const YES = 'yes'
const EMAIL = 'land/email'
const CORRECT_EMAIL = 'land/correct-email'
const CONFIRM_EMAIL = YES
const EMAIL_VALUE = 'email-value'
const AWAITING_PROCESSING = 'AwaitingProcessing'
const SUCCESS = 'Success'
const FILE_INACCESSIBLE = 'FileInaccessible'
const QUARANTINED = 'Quarantined'
const FAILED_TO_VIRUS_SCAN = 'FailedToVirusScan'
const ELIGIBILITY_CHECK_YOU_CAN_REGISTER = 'land/check-you-can-register'
const ELIGIBILITY_SITE_IN_ENGLAND = 'land/site-in-england'
const ELIGIBILITY_CANNOT_CONTINUE = 'land/cannot-continue'
const ELIGIBILITY_CONSENT = 'land/consent'
const ELIGIBILITY_LEGAL_AGREEMENT = 'land/legal-agreement'
const ELIGIBILITY_OWNERSHIP_PROOF = 'land/ownership-proof'
const ELIGIBILITY_BOUNDARY = 'land/boundary'
const ELIGIBILITY_BIODIVERSITY_METRIC = 'land/biodiversity-metric'
const ELIGIBILITY_HMMP = 'land/habitat-management-plan'
const ELIGIBILITY_RESULTS = 'land/results'

const confirmFileUploadOptions = {
  NO,
  NO_AGAIN,
  YES
}
const landBoundaryUploadTypes = {
  GEOSPATIAL_DATA,
  DOCUMENT_UPLOAD
}

const LEGAL_AGREEMENT_FILE_EXT = [
  '.doc',
  '.docx',
  '.pdf'
]

const LEGAL_LAND_BOUNDARY_FILE_EXT = [
  '.doc',
  '.docx',
  '.jpg',
  '.png',
  '.pdf'
]

const GEOSPATIAL_LEGAL_LAND_BOUNDARY_FILE_EXT = [
  '.geojson',
  '.gpkg',
  '.zip'
]

const METRIC_FILE_EXT = [
  '.xlsm',
  '.xlsx'
]
const LAND_OWNERSHIP_FILE_EXT = [
  '.doc',
  '.docx',
  '.pdf'
]

const LEGAL_AGREEMENT_DOCUMENTS = [
  {
    id: '759150000',
    type: 'planningObligation',
    text: 'Planning obligation (section 106 agreement)',
    htmlId: 'planning-obligation'
  },
  {
    id: '759150001',
    type: 'conservationCovenant',
    text: 'Conservation covenant',
    htmlId: 'conservation-covenant'
  },
  {
    id: '759150002',
    type: 'other',
    text: 'Other'
  },
  {
    id: '-1',
    type: 'noDocument',
    text: 'I do not have a legal agreement',
    htmlId: 'dont-have-document'
  }
]

const redisKeys = {
  GAIN_SITE_REFERENCE,
  ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION,
  GEOSPATIAL_UPLOAD_LOCATION,
  GEOSPATIAL_MAP_CONFIG,
  GEOSPATIAL_UPLOAD_TYPE,
  GEOSPATIAL_FILE_NAME,
  GEOSPATIAL_FILE_SIZE,
  GEOSPATIAL_FILE_TYPE,
  GEOSPATIAL_HECTARES,
  GEOSPATIAL_GRID_REFERENCE,
  LAND_BOUNDARY_MAP_CONFIG,
  LAND_BOUNDARY_UPLOAD_TYPE,
  LAND_BOUNDARY_LOCATION,
  LAND_BOUNDARY_FILE_SIZE,
  LAND_BOUNDARY_FILE_TYPE,
  LAND_BOUNDARY_CHECKED,
  LAND_BOUNDARY_GRID_REFERENCE,
  LAND_BOUNDARY_HECTARES,
  LEGAL_AGREEMENT_CHECKED,
  LEGAL_AGREEMENT_LOCATION,
  LEGAL_AGREEMENT_DOCUMENT_TYPE,
  LEGAL_AGREEMENT_FILE_SIZE,
  LEGAL_AGREEMENT_FILE_TYPE,
  LEGAL_AGREEMENT_PARTIES_KEY,
  MANAGEMENT_PLAN_KEY,
  LEGAL_AGREEMENT_FILE_OPTION,
  LEGAL_AGREEMENT_PARTIES,
  MANAGEMENT_PLAN_CHECKED,
  MANAGEMENT_PLAN_LOCATION,
  MANAGEMENT_PLAN_FILE_SIZE,
  MANAGEMENT_PLAN_FILE_TYPE,
  METRIC_FILE_TYPE,
  METRIC_UPLOAD_KEY,
  LAND_OWNERSHIP_LOCATION,
  LAND_OWNERSHIP_FILE_SIZE,
  LAND_OWNERSHIP_CHECKED,
  LAND_OWNERSHIP_FILE_TYPE,
  METRIC_LOCATION,
  METRIC_FILE_SIZE,
  FULL_NAME,
  ROLE_KEY,
  NAME_KEY,
  ROLE_OTHER,
  HABITAT_WORKS_START_DATE_KEY,
  REGISTERED_LANDOWNER_ONLY,
  LANDOWNERS,
  LANDOWNER_CONSENT_KEY,
  LEGAL_AGREEMENT_START_DATE_KEY,
  METRIC_FILE_CHECKED,
  MANAGEMENT_MONITORING_START_DATE_KEY,
  LEGAL_AGREEMENT_ORGANISATION_NAMES,
  LEGAL_AGREEMENT_ORGANISATION_NAMES_CHECKED,
  LEGAL_AGREEMENT_OTHER_PARTY_NAMES,
  LEGAL_AGREEMENT_START_DAY,
  LEGAL_AGREEMENT_START_MONTH,
  LEGAL_AGREEMENT_START_YEAR,
  REGISTRATION_TASK_DETAILS,
  LAND_OWNERSHIP_KEY,
  METRIC_UPLOADED_ANSWER,
  REFERER,
  EMAIL_VALUE,
  CONFIRM_EMAIL,
  ELIGIBILITY_SITE_IN_ENGLAND,
  ELIGIBILITY_CONSENT,
  ELIGIBILITY_LEGAL_AGREEMENT,
  ELIGIBILITY_OWNERSHIP_PROOF,
  ELIGIBILITY_BOUNDARY,
  ELIGIBILITY_BIODIVERSITY_METRIC,
  ELIGIBILITY_HMMP
}

const routes = {
  ABOUT,
  ADD_GRID_REFERENCE,
  ADD_HECTARES,
  ERROR,
  CHECK_LEGAL_AGREEMENT,
  ADD_LEGAL_AGREEMENT_PARTIES,
  LEGAL_AGREEMENT_START_DATE,
  LEGAL_AGREEMENT_TYPE,
  CHECK_MANAGEMENT_PLAN,
  REGISTRATION_SUBMITTED,
  CHECK_AND_SUBMIT,
  CHECK_LAND_BOUNDARY,
  CHECK_PROOF_OF_OWNERSHIP,
  CHECK_UPLOAD_METRIC,
  CHECK_GEOSPATIAL_FILE,
  DOWNLOAD_LEGAL_AGREEMENT,
  DOWNLOAD_MANAGEMENT_PLAN,
  DOWNLOAD_LAND_BOUNDARY,
  DOWNLOAD_GEOSPATIAL_LAND_BOUNDARY,
  DOWNLOAD_METRIC_FILE,
  DOWNLOAD_LAND_OWNERSHIP,
  GEOSPATIAL_LAND_BOUNDARY,
  CHOOSE_LAND_BOUNDARY_UPLOAD,
  OS_API_TOKEN,
  PUBLIC_ROUTES,
  SESSION,
  START,
  UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  UPLOAD_MANAGEMENT_PLAN,
  UPLOAD_METRIC,
  UPLOAD_LEGAL_AGREEMENT,
  CHECK_LEGAL_AGREEMENT_DETAILS,
  UPLOAD_LAND_BOUNDARY,
  CHECK_LAND_BOUNDARY_DETAILS,
  UPLOAD_LAND_OWNERSHIP,
  HOME,
  NAME,
  ROLE,
  CHECK_YOUR_DETAILS,
  REGISTER_LAND_TASK_LIST,
  HABITAT_WORKS_START_DATE,
  MANAGEMENT_MONITORING_START_DATE,
  CHECK_MANAGEMENT_MONITORING_DETAILS,
  REGISTERED_LANDOWNER,
  ADD_LANDOWNERS,
  LANDOWNER_CONSENT,
  CHECK_OWNERSHIP_DETAILS,
  NEED_BOUNDARY_FILE,
  NEED_OWNERSHIP_PROOF,
  NEED_METRIC,
  NEED_MANAGEMENT_PLAN,
  NEED_LEGAL_AGREEMENT,
  EMAIL,
  CORRECT_EMAIL,
  ELIGIBILITY_CHECK_YOU_CAN_REGISTER,
  ELIGIBILITY_SITE_IN_ENGLAND,
  ELIGIBILITY_CANNOT_CONTINUE,
  ELIGIBILITY_CONSENT,
  ELIGIBILITY_LEGAL_AGREEMENT,
  ELIGIBILITY_OWNERSHIP_PROOF,
  ELIGIBILITY_BOUNDARY,
  ELIGIBILITY_BIODIVERSITY_METRIC,
  ELIGIBILITY_HMMP,
  ELIGIBILITY_RESULTS
}

const uploadErrors = {
  uploadFailure: 'The selected file could not be uploaded -- try again',
  noFile: 'Non-file received',
  emptyFile: 'Empty file',
  threatDetected: 'The selected file contains a virus',
  unsupportedFileExt: 'Unsupported file extension'
}

const threatScreeningStatusValues = {
  AWAITING_PROCESSING,
  SUCCESS,
  FILE_INACCESSIBLE,
  QUARANTINED,
  FAILED_TO_VIRUS_SCAN
}

const uploadTypes = {
  GEOSPATIAL_UPLOAD_TYPE,
  LEGAL_AGREEMENT_UPLOAD_TYPE,
  MANAGEMENT_PLAN_UPLOAD_TYPE,
  LAND_BOUNDARY_UPLOAD_TYPE,
  METRIC_UPLOAD_TYPE,
  LAND_OWNERSHIP_UPLOAD_TYPE
}

const eligibilityHTML = {
  [ELIGIBILITY_BOUNDARY]: '<li>the boundary of the land</li>',
  [ELIGIBILITY_CONSENT]: '<li>consent from the landowner</li>',
  [ELIGIBILITY_OWNERSHIP_PROOF]: '<li>proof of ownership of the land</li>',
  [ELIGIBILITY_BIODIVERSITY_METRIC]: '<li>a completed Biodiversity metric (Secretary of State version) for the land</li>',
  [ELIGIBILITY_HMMP]: '<li>a habitat management and monitoring plan</li>',
  [ELIGIBILITY_LEGAL_AGREEMENT]: '<li>a legal agreement securing the habitat enhancements for 30 years</li>'
}

// setReferer contain routes that can be set as a referer for a user
// to return to from a "check your answers" page
const setReferer = [
  CHECK_AND_SUBMIT,
  CHECK_YOUR_DETAILS,
  CHECK_OWNERSHIP_DETAILS,
  CHECK_LEGAL_AGREEMENT_DETAILS,
  CHECK_MANAGEMENT_MONITORING_DETAILS,
  CHECK_LAND_BOUNDARY_DETAILS,
  CORRECT_EMAIL
]

// Add a route to clearReferer to break the above setReferer chain
const clearReferer = [
  REGISTER_LAND_TASK_LIST
]

const views = Object.assign({ INTERNAL_SERVER_ERROR: '500' }, routes)

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

export default Object.freeze({
  confirmLandBoundaryOptions: confirmFileUploadOptions,
  confirmLegalAgreementOptions: confirmFileUploadOptions,
  confirmManagementPlanOptions: confirmFileUploadOptions,
  managementPlanFileExt: LEGAL_AGREEMENT_FILE_EXT,
  landBoundaryFileExt: LEGAL_LAND_BOUNDARY_FILE_EXT,
  geospatialLandBoundaryFileExt: GEOSPATIAL_LEGAL_LAND_BOUNDARY_FILE_EXT,
  lanOwnerFileExt: LAND_OWNERSHIP_FILE_EXT,
  legalAgreementFileExt: LEGAL_AGREEMENT_FILE_EXT,
  gridReferenceRegEx: GRID_REFERENCE_REGEX,
  metricFileExt: METRIC_FILE_EXT,
  landBoundaryUploadTypes,
  redisKeys,
  routes,
  views,
  uploadErrors,
  threatScreeningStatusValues,
  uploadTypes,
  DEFAULT_REGISTRATION_TASK_STATUS,
  COMPLETE_REGISTRATION_TASK_STATUS,
  setReferer,
  clearReferer,
  LEGAL_AGREEMENT_DOCUMENTS,
  eligibilityHTML
})
