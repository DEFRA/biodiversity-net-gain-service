import developerConstants from './developer-constants.js'
import { NODE_ENV, AZURE_FUNCTION_APP_URL } from './config.js'
import lojConstants from './loj-constants.js'
import creditsConstants from '../credits/constants.js'
import disabledRoutesContants from './disabled-routes-constants.js'

const APPLICATION_TYPE = 'application-type'
const DOCUMENT_UPLOAD = 'documentUpload'
const GEOSPATIAL_DATA = 'geospatialData'
const GRID_REFERENCE_REGEX = /^([STNHOstnho][A-Za-z]\s?)(\d{5}\s?\d{5}|\d{4}\s?\d{4}|\d{3}\s?\d{3}|\d{2}\s?\d{2}|\d{1}\s?\d{1})$/
const MINIMUM_START_DATE = '2020-01-30T00:00:00.000Z'
const LEGAL_AGREEMENT_MIN_START_DATE = MINIMUM_START_DATE
const NO = 'no'
const NO_AGAIN = 'noAgain'
const HABITAT_WORKS_MIN_START_DATE = MINIMUM_START_DATE
const MANAGEMENT_MONITORING_MIN_START_DATE = MINIMUM_START_DATE
const DEFAULT_REGISTRATION_TASK_STATUS = 'NOT STARTED'
const IN_PROGRESS_REGISTRATION_TASK_STATUS = 'IN PROGRESS'
const COMPLETE_REGISTRATION_TASK_STATUS = 'COMPLETED'
const YES = 'yes'
const AWAITING_PROCESSING = 'AwaitingProcessing'
const SUCCESS = 'Success'
const FILE_INACCESSIBLE = 'FileInaccessible'
const QUARANTINED = 'Quarantined'
const FAILED_TO_VIRUS_SCAN = 'FailedToVirusScan'
const TEST_SEED_DATA = 'test/seed-data'
const SIGNIN = 'signin'
const SIGNIN_CALLBACK = 'signin/callback'
const SIGNOUT = 'signout'
const SIGNED_OUT = 'signed-out'
const CONTACT_ID = 'contact-id'
const REGISTRATION = 'Registration'
const ALLOCATION = 'Allocation'
const SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE = 'save-application-session-on-signout-or-journey-change'
const PRE_AUTHENTICATION_ROUTE = 'pre-authentication-route'
const MANAGE_BIODIVERSITY_GAINS = 'manage-biodiversity-gains'
const SAVE_APPLICATION_SESSION_ON_SIGNOUT = 'save-application-session-on-signout'

const applicationTypes = {
  REGISTRATION,
  ALLOCATION
}
const APPLICATION_SUBMITTED = 'application-submitted'
const TEST_DEVELOPER_SEED_DATA = 'test/seed-developer-data'

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
const LOCAL_LAND_CHARGE_FILE_EXT = [
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

const CONFIRM_DEVELOPMENT_DETAILS = {
  NO,
  YES
}

const CHECK_UPLOAD_METRIC_OPTIONS = {
  NO,
  YES
}

const DEVELOPER_CONFIRM_OFF_SITE_GAIN = {
  NO,
  YES
}

const redisKeys = {
  ...developerConstants.redisKeys,
  ...lojConstants.redisKeys,
  APPLICATION_TYPE,
  CONTACT_ID,
  SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE,
  PRE_AUTHENTICATION_ROUTE,
  SAVE_APPLICATION_SESSION_ON_SIGNOUT
}

let routes = {
  ...creditsConstants.routes,
  ...developerConstants.routes,
  ...lojConstants.routes,
  MANAGE_BIODIVERSITY_GAINS,
  SIGNIN,
  SIGNIN_CALLBACK,
  SIGNOUT,
  SIGNED_OUT,
  APPLICATION_SUBMITTED
}

// Routes that are only loaded if NODE_ENV === development
const testRoutes = {
  TEST_SEED_DATA,
  TEST_DEVELOPER_SEED_DATA
}

if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  routes = { ...routes, ...testRoutes }
}

routes = { ...routes, ...disabledRoutesContants }

const uploadErrors = {
  uploadFailure: 'The selected file could not be uploaded -- try again',
  noFile: 'Non-file received',
  emptyFile: 'Empty file',
  maximumFileSizeExceeded: 'Maxiumum file size exceeded',
  threatDetected: 'The selected file contains a virus',
  unsupportedFileExt: 'Unsupported file extension',
  noFileScanResponse: 'Timed out awaiting anti virus scan result'
}

const threatScreeningStatusValues = {
  AWAITING_PROCESSING,
  SUCCESS,
  FILE_INACCESSIBLE,
  QUARANTINED,
  FAILED_TO_VIRUS_SCAN
}

const uploadTypes = {
  ...developerConstants.uploadTypes,
  ...lojConstants.uploadTypes
}

// setReferer contain routes that can be set as a referer for a user
// to return to from a "check your answers" page
const setReferer = [
  ...lojConstants.setLojReferer,
  ...developerConstants.setDeveloperReferer
]

// Add a route to clearReferer to break the above setReferer chain
const clearReferer = [
  ...lojConstants.clearLojReferer,
  ...developerConstants.clearDeveloperReferer
]

const views = { ...{ INTERNAL_SERVER_ERROR: '500' }, ...routes }

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

const minStartDates = {
  LEGAL_AGREEMENT_MIN_START_DATE,
  HABITAT_WORKS_MIN_START_DATE,
  MANAGEMENT_MONITORING_MIN_START_DATE
}

export default Object.freeze({
  applicationTypes,
  confirmLandBoundaryOptions: confirmFileUploadOptions,
  confirmLegalAgreementOptions: confirmFileUploadOptions,
  confirmManagementPlanOptions: confirmFileUploadOptions,
  managementPlanFileExt: LEGAL_AGREEMENT_FILE_EXT,
  landBoundaryFileExt: LEGAL_LAND_BOUNDARY_FILE_EXT,
  geospatialLandBoundaryFileExt: GEOSPATIAL_LEGAL_LAND_BOUNDARY_FILE_EXT,
  lanOwnerFileExt: LAND_OWNERSHIP_FILE_EXT,
  legalAgreementFileExt: LEGAL_AGREEMENT_FILE_EXT,
  localLandChargeFileExt: LOCAL_LAND_CHARGE_FILE_EXT,
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
  IN_PROGRESS_REGISTRATION_TASK_STATUS,
  COMPLETE_REGISTRATION_TASK_STATUS,
  setReferer,
  clearReferer,
  LEGAL_AGREEMENT_DOCUMENTS,
  CONFIRM_DEVELOPMENT_DETAILS,
  CHECK_UPLOAD_METRIC_OPTIONS,
  minStartDates,
  AZURE_FUNCTION_APP_URL,
  DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  consentFileExt: developerConstants.consentFileExt,
  ...developerConstants.options,
  creditsEstimationPath: creditsConstants.CREDITS_ESTIMATION_PATH
})
