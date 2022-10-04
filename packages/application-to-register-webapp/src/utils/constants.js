const ABOUT = 'about'
const ADD_GRID_REFERENCE = 'land/add-grid-reference'
const ADD_HECTARES = 'land/add-hectares'
const CHECK_LEGAL_AGREEMENT = 'land/check-legal-agreement-file'
const CHECK_MANAGEMENT_PLAN = 'land/check-management-plan-file'
const CONFIRM_GEOSPATIAL_LAND_BOUNDARY = 'land/check-geospatial-land-boundary-file'
const DOCUMENT_UPLOAD = 'documentUpload'
const DOWNLOAD_LEGAL_AGREEMENT = 'land/download-legal-agreement-file'
const DOWNLOAD_MANAGEMENT_PLAN = 'land/download-management-plan-file'
const DOWNLOAD_LAND_BOUNDARY = 'land/download-land-boundary-file'
const DOWNLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/download-geospatial-land-boundary-file'
const DOWNLOAD_METRIC_FILE = 'land/download-metric-file'
const ERROR = 'error'
const GEOSPATIAL_DATA = 'geospatialData'
const GEOSPATIAL_LAND_BOUNDARY = 'land/geospatial-land-boundary'
const GEOSPATIAL_LOCATION = 'geospatial-location'
const GEOSPATIAL_MAP_CONFIG = 'geospatial-map-config'
const LAND_BOUNDARY_MAP_CONFIG = 'land-boundary-map-config'
const GEOSPATIAL_FILE_NAME = 'geospatial_filename'
const GEOSPATIAL_FILE_SIZE = 'geospatial-file-size'
const CHOOSE_GEOSPATIAL_UPLOAD = 'land/choose-land-boundary-upload-option'
const GEOSPATIAL_UPLOAD_TYPE = 'geospatial-land-boundary'
const GRID_REFERENCE_REGEX = /^([STNHOstnho][A-Za-z]\s?)(\d{5}\s?\d{5}|\d{4}\s?\d{4}|\d{3}\s?\d{3}|\d{2}\s?\d{2}|\d{1}\s?\d{1})$/
const LEGAL_AGREEMENT_CHECKED = 'legal-agreement-checked'
const LEGAL_AGREEMENT_FILE_SIZE = 'legal-agreement-file-size'
const LEGAL_AGREEMENT_LOCATION = 'legal-agreement-location'
const LEGAL_AGREEMENT_UPLOAD_TYPE = 'legal-agreement'
const MANAGEMENT_PLAN_CHECKED = 'management-plan-checked'
const MANAGEMENT_PLAN_FILE_SIZE = 'management-plan-file-size'
const MANAGEMENT_PLAN_LOCATION = 'management-plan-location'
const MANAGEMENT_PLAN_UPLOAD_TYPE = 'management-plan'
const NO = 'no'
const NO_AGAIN = 'noAgain'
const OS_API_TOKEN = 'land/os-api-token'
const PUBLIC = 'public'
const SESSION = 'session'
const START = 'start'
const UPLOAD_GEOSPATIAL_LAND_BOUNDARY = 'land/upload-geospatial-file'
const UPLOAD_MANAGEMENT_PLAN = 'land/upload-management-plan'
const UPLOAD_LEGAL_AGREEMENT = 'land/upload-legal-agreement'
const UPLOAD_LAND_BOUNDARY = 'land/upload-land-boundary'
const LAND_BOUNDARY_CHECKED = 'land-boundary-checked'
const METRIC_FILE_CHECKED = 'metric-file-checked'
const LAND_BOUNDARY_FILE_SIZE = 'land-boundary-file-size'
const LAND_BOUNDARY_LOCATION = 'land-boundary-location'
const LAND_BOUNDARY_UPLOAD_TYPE = 'land-boundary'
const LAND_BOUNDARY_GRID_REFERENCE = 'land-boundary-grid-reference'
const LAND_BOUNDARY_HECTARES = 'land-boundary-hectares'
const CHECK_LAND_BOUNDARY = 'land/check-land-boundary-file'
const UPLOAD_METRIC = 'land/upload-metric'
const CHECK_UPLOAD_METRIC = 'land/check-metric-file'
const METRIC_LOCATION = 'metric-file-location'
const METRIC_FILE_SIZE = 'metric-file-size'
const METRIC_UPLOAD_TYPE = 'metric-upload'
const HABITAT_WORKS_START_DATE = 'land/habitat-works-start-date'
const HABITAT_WORKS_START_DATE_KEY = 'habitat-works-start-date'
const MANAGEMENT_MONITORING_START_DATE = 'land/management-monitoring-start-date'
const MANAGEMENT_MONITORING_START_DATE_KEY = 'management-monitoring-start-date'

const YES = 'yes'

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
const METRIC_FILE_EXT = [
  '.xlsm',
  '.xlsx'
]

const redisKeys = {
  GEOSPATIAL_LOCATION,
  GEOSPATIAL_MAP_CONFIG,
  GEOSPATIAL_UPLOAD_TYPE,
  GEOSPATIAL_FILE_NAME,
  GEOSPATIAL_FILE_SIZE,
  LAND_BOUNDARY_MAP_CONFIG,
  LAND_BOUNDARY_UPLOAD_TYPE,
  LAND_BOUNDARY_LOCATION,
  LAND_BOUNDARY_FILE_SIZE,
  LAND_BOUNDARY_CHECKED,
  LAND_BOUNDARY_GRID_REFERENCE,
  LAND_BOUNDARY_HECTARES,
  LEGAL_AGREEMENT_CHECKED,
  LEGAL_AGREEMENT_LOCATION,
  LEGAL_AGREEMENT_FILE_SIZE,
  MANAGEMENT_PLAN_CHECKED,
  MANAGEMENT_PLAN_LOCATION,
  MANAGEMENT_PLAN_FILE_SIZE,
  METRIC_LOCATION,
  METRIC_FILE_SIZE,
  METRIC_FILE_CHECKED,
  HABITAT_WORKS_START_DATE_KEY,
  MANAGEMENT_MONITORING_START_DATE_KEY
}

const routes = {
  ABOUT,
  ADD_GRID_REFERENCE,
  ADD_HECTARES,
  ERROR,
  CHECK_LEGAL_AGREEMENT,
  CHECK_MANAGEMENT_PLAN,
  CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  DOWNLOAD_LEGAL_AGREEMENT,
  DOWNLOAD_MANAGEMENT_PLAN,
  DOWNLOAD_LAND_BOUNDARY,
  DOWNLOAD_GEOSPATIAL_LAND_BOUNDARY,
  DOWNLOAD_METRIC_FILE,
  GEOSPATIAL_LAND_BOUNDARY,
  CHOOSE_GEOSPATIAL_UPLOAD,
  OS_API_TOKEN,
  PUBLIC,
  SESSION,
  START,
  UPLOAD_GEOSPATIAL_LAND_BOUNDARY,
  UPLOAD_MANAGEMENT_PLAN,
  UPLOAD_LEGAL_AGREEMENT,
  UPLOAD_LAND_BOUNDARY,
  CHECK_LAND_BOUNDARY,
  UPLOAD_METRIC,
  CHECK_UPLOAD_METRIC,
  HABITAT_WORKS_START_DATE,
  MANAGEMENT_MONITORING_START_DATE
}

const uploadErrors = {
  noFile: 'Non-file received',
  unsupportedFileExt: 'Unsupported file extension'
}

const uploadTypes = {
  GEOSPATIAL_UPLOAD_TYPE,
  LEGAL_AGREEMENT_UPLOAD_TYPE,
  MANAGEMENT_PLAN_UPLOAD_TYPE,
  LAND_BOUNDARY_UPLOAD_TYPE,
  METRIC_UPLOAD_TYPE
}
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
  legalAgreementFileExt: LEGAL_AGREEMENT_FILE_EXT,
  gridReferenceRegEx: GRID_REFERENCE_REGEX,
  metricFileExt: METRIC_FILE_EXT,
  landBoundaryUploadTypes,
  redisKeys,
  routes,
  views,
  uploadErrors,
  uploadTypes
})
