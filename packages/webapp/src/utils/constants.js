import lojConstants from './loj-constants.js'
import developerConstants from './developer-constants.js'
import combinedCaseConstants from './combined-case-constants.js'
import creditsPurchaseConstants from './credits-purchase-constants.js'
import disabledRoutesContants from './disabled-routes-constants.js'
import { NODE_ENV, AZURE_FUNCTION_APP_URL, AMENDMENT_GUIDE_URL_ALLOCATION, AMENDMENT_GUIDE_URL_REGISTRATION } from './config.js'

// Application Sections
const REGISTRATION = 'Registration'
const ALLOCATION = 'Allocation'
const COMBINED_CASE = 'CombinedCase'
const CREDITS_PURCHASE = 'CreditsPurchase'

// Application Types
const AGENT = 'Agent'
const CITIZEN = 'Citizen'
const EMPLOYEE = 'Employee'
const LANDOWNER = 'landowner'
const REPRESENTATIVE = 'representative'
const INTERNATIONAL = 'international'
const UK = 'uk'
const INDIVIDUAL = 'individual'
const ORGANISATION = 'organisation'

// Boolean Values
const NO = 'no'
const YES = 'yes'

// Dates
const MINIMUM_START_DATE = '2020-01-30T00:00:00.000Z'
const LEGAL_AGREEMENT_MIN_START_DATE = MINIMUM_START_DATE
const HABITAT_WORKS_MIN_START_DATE = MINIMUM_START_DATE
const MANAGEMENT_MONITORING_MIN_START_DATE = MINIMUM_START_DATE

// File Processing Statuses
const AWAITING_PROCESSING = 'AwaitingProcessing'
const FILE_INACCESSIBLE = 'FileInaccessible'
const FAILED_TO_VIRUS_SCAN = 'FailedToVirusScan'
const QUARANTINED = 'Quarantined'
const SUCCESS = 'Success'
const XSS_VULNERABILITY_FOUND = 'XSSVulnerabilityFound'

// File Upload
const BLOB_STORAGE_CONTAINER = 'customer-uploads'
const DOCUMENT_UPLOAD = 'documentUpload'
const MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED = 'multipleProofsOfPermissionRequired'

// Geospatial Data
const GEOSPATIAL_DATA = 'geospatialData'
const GRID_REFERENCE_REGEX = /^([STNHOstnho][A-Za-z]\s?)(\d{5}\s?\d{5}|\d{4}\s?\d{4}|\d{3}\s?\d{3}|\d{2}\s?\d{2}|\d{1}\s?\d{1})$/

// Identifiers
const CONTACT_ID = 'contact-id'
const ORGANISATION_ID = 'organisation-id'

const LEGAL_AGREEMENT_TYPE_CONSERVATION = 'Conservation covenant'

// Routes
const ACCESSIBILITY_STATEMENT = 'accessibility-statement'
const APPLICATION_SUBMITTED = 'application-submitted'
const APPLICATION_TYPE = 'application-type'
const COOKIES = 'cookies'
const HEALTHY = 'healthy'
const MANAGE_BIODIVERSITY_GAINS = 'manage-biodiversity-gains'
const PRE_AUTHENTICATION_ROUTE = 'pre-authentication-route'
const PRIMARY_ROUTE = 'primary-route'
const SAVE_APPLICATION_SESSION_ON_SIGNOUT = 'save-application-session-on-signout'
const SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE = 'save-application-session-on-signout-or-journey-change'
const SIGNIN = 'signin'
const SIGNIN_CALLBACK = 'signin/callback'
const SIGNOUT = 'signout'
const SIGNED_OUT = 'signed-out'

// Task Statuses
const CANNOT_START_YET_STATUS = 'CANNOT START YET'
const COMPLETE_REGISTRATION_TASK_STATUS = 'COMPLETED'
const DEFAULT_REGISTRATION_TASK_STATUS = 'NOT STARTED'
const IN_PROGRESS_REGISTRATION_TASK_STATUS = 'IN PROGRESS'
const NOT_STARTED_YET_STATUS = 'NOT STARTED YET'

// Test Data
const TEST_API_GAINSITE = 'test/api/gainsite'
const TEST_COMBINED_CASE_SEED_DATA = 'test/seed-combined-case-data'
const TEST_CREDITS_PURCHASE_DATA = 'test/seed-credits-purchase-data'
const TEST_DEVELOPER_SEED_DATA = 'test/seed-developer-data'
const TEST_SEED_DATA = 'test/seed-data'

// Valid Referrers
const COMBINED_CASE_APPLICANT_INFO_VALID_REFERRERS = ['/combined-case/check-applicant-information', '/combined-case/check-and-submit']
const COMBINED_CASE_BOUNDARY_VALID_REFERRERS = ['/combined-case/check-land-boundary-details', '/combined-case/check-and-submit']
const COMBINED_CASE_LEGAL_AGREEMENT_VALID_REFERRERS = ['/combined-case/check-legal-agreement-details', '/combined-case/check-and-submit']
const COMBINED_CASE_METRIC_VALID_REFERRERS = ['/combined-case/check-metric-details', '/combined-case/check-and-submit']
const LAND_APPLICANT_INFO_VALID_REFERRERS = ['/land/check-applicant-information', '/land/check-and-submit']
const LAND_BOUNDARY_VALID_REFERRERS = ['/land/check-land-boundary-details', '/land/check-and-submit']
const LAND_LEGAL_AGREEMENT_VALID_REFERRERS = ['/land/check-legal-agreement-details', '/land/check-and-submit']
const LAND_METRIC_VALID_REFERRERS = ['/land/check-metric-details', '/land/check-and-submit']

// ================================================================================= //

// Options
const JOURNEY_START_ANSWER_ID = 'journey-start-answer-id'
const JOURNERY_START_ANSWER_ID_HANDLED = 'journey-start-answer-id-handled'

const applicationTypes = {
  ALLOCATION,
  COMBINED_CASE,
  CREDITS_PURCHASE,
  REGISTRATION
}

const ADDRESS_IS_UK = {
  NO,
  YES
}

const ADDRESS_TYPES = {
  INTERNATIONAL,
  UK
}

const APPLICANT_IS_AGENT = {
  NO,
  YES
}

const CHECK_UPLOAD_METRIC_OPTIONS = {
  NO,
  YES
}

const confirmFileUploadOptions = {
  NO,
  YES
}

const DEVELOPER_CONFIRM_OFF_SITE_GAIN = {
  NO,
  YES
}

const DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER = {
  NO,
  YES
}

const landBoundaryUploadTypes = {
  GEOSPATIAL_DATA,
  DOCUMENT_UPLOAD
}

// File Extensions
const GEOSPATIAL_LEGAL_LAND_BOUNDARY_FILE_EXT = ['.geojson', '.gpkg', '.zip']
const LAND_OWNERSHIP_FILE_EXT = ['.doc', '.docx', '.pdf']
const LEGAL_AGREEMENT_FILE_EXT = ['.doc', '.docx', '.pdf']
const LEGAL_LAND_BOUNDARY_FILE_EXT = ['.doc', '.docx', '.jpg', '.png', '.pdf']
const LOCAL_LAND_CHARGE_FILE_EXT = ['.doc', '.docx', '.pdf']
const METRIC_FILE_EXT = ['.xlsm', '.xlsx']

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
  ...developerConstants.redisKeys,
  ...lojConstants.redisKeys,
  ...combinedCaseConstants.redisKeys,
  APPLICATION_TYPE,
  CONTACT_ID,
  ORGANISATION_ID,
  SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE,
  PRE_AUTHENTICATION_ROUTE,
  SAVE_APPLICATION_SESSION_ON_SIGNOUT,
  PRIMARY_ROUTE,
  JOURNEY_START_ANSWER_ID,
  JOURNERY_START_ANSWER_ID_HANDLED
}

let routes = {
  ...lojConstants.routes,
  MANAGE_BIODIVERSITY_GAINS,
  HEALTHY,
  SIGNIN,
  SIGNIN_CALLBACK,
  SIGNOUT,
  SIGNED_OUT,
  APPLICATION_SUBMITTED,
  ACCESSIBILITY_STATEMENT,
  COOKIES
}

const reusedRoutes = {
  ...combinedCaseConstants.reusedRoutes
}

// Routes that are only loaded if NODE_ENV === development
const testRoutes = {
  TEST_SEED_DATA,
  TEST_DEVELOPER_SEED_DATA,
  TEST_CREDITS_PURCHASE_DATA,
  TEST_API_GAINSITE,
  TEST_COMBINED_CASE_SEED_DATA
}

if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  routes = { ...routes, ...testRoutes }
}

routes = { ...routes, ...disabledRoutesContants }

const uploadErrors = {
  uploadFailure: 'The selected file could not be uploaded - try again',
  noFile: 'Non-file received',
  emptyFile: 'Empty file',
  maximumFileSizeExceeded: 'Maxiumum file size exceeded',
  threatDetected: 'The selected file contains a virus',
  malwareScanFailed: 'File malware scan failed',
  unsupportedFileExt: 'Unsupported file extension',
  noFileScanResponse: 'Timed out awaiting anti virus scan result',
  notValidMetric: 'Workbook is not a valid metric'
}

const threatScreeningStatusValues = {
  AWAITING_PROCESSING,
  SUCCESS,
  FILE_INACCESSIBLE,
  QUARANTINED,
  FAILED_TO_VIRUS_SCAN,
  XSS_VULNERABILITY_FOUND
}

const uploadTypes = {
  ...developerConstants.uploadTypes,
  ...lojConstants.uploadTypes
}

// setReferer contain routes that can be set as a referer for a user
// to return to from a "check your answers" page
const setReferer = [
  ...lojConstants.setLojReferer,
  ...developerConstants.setDeveloperReferer,
  ...creditsPurchaseConstants.setCreditReferer,
  ...combinedCaseConstants.setCombinedRefer
]

// Add a route to clearReferer to break the above setReferer chain
const clearReferer = [
  ...developerConstants.clearDeveloperReferer,
  ...combinedCaseConstants.clearCombinedRefer
]

const views = { ...{ INTERNAL_SERVER_ERROR: '500' }, ...routes }

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

// The answerIdHandler plugin tracks which item is being changed on specific pages so we focus on that item when the
// user returns to the page. The answerIdRoutes array specifies which pages we do this for -- these will likely be the
// task list, check and submit, and any "mini" check and submit pages. Note that we must define this _after_ we've added
// `/` to the start of each route as our matching in answerIdHandler will fail otherwise.
const answerIdRoutes = [
  routes.COMBINED_CASE_TASK_LIST,
  routes.COMBINED_CASE_CHECK_AND_SUBMIT,
  reusedRoutes.COMBINED_CASE_CHECK_APPLICANT_INFORMATION,
  reusedRoutes.COMBINED_CASE_CHECK_LEGAL_AGREEMENT_DETAILS
]

// The answerIdClearRoutes array specifies pages where we clear any stored answer id because they signify a user has
// "broken out" of their journey and therefore any stored answer id is no longer relevant.
const answerIdClearRoutes = [
  routes.COMBINED_CASE_PROJECTS
]

const minStartDates = {
  LEGAL_AGREEMENT_MIN_START_DATE,
  HABITAT_WORKS_MIN_START_DATE,
  MANAGEMENT_MONITORING_MIN_START_DATE
}

const individualOrOrganisationTypes = {
  INDIVIDUAL,
  ORGANISATION
}

const signInTypes = {
  AGENT,
  CITIZEN,
  EMPLOYEE
}

const applicantTypes = {
  AGENT: AGENT.toLowerCase(),
  LANDOWNER,
  REPRESENTATIVE
}

const primaryPages = {
  [REGISTRATION]: [`/${lojConstants.routes.REGISTER_LAND_TASK_LIST}`, `/${lojConstants.routes.CHECK_AND_SUBMIT}`],
  [ALLOCATION]: [`/${developerConstants.routes.DEVELOPER_TASKLIST}`, `/${developerConstants.routes.DEVELOPER_CHECK_AND_SUBMIT}`],
  [CREDITS_PURCHASE]: [creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST, creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_YOUR_ANSWERS],
  [COMBINED_CASE]: [`/${combinedCaseConstants.routes.COMBINED_CASE_TASK_LIST}`, `/${combinedCaseConstants.routes.COMBINED_CASE_CHECK_AND_SUBMIT}`]
}

export default Object.freeze({
  ADDRESS_IS_UK,
  ADDRESS_TYPES,
  AMENDMENT_GUIDE_URL_ALLOCATION,
  AMENDMENT_GUIDE_URL_REGISTRATION,
  APPLICANT_IS_AGENT,
  applicantTypes,
  applicationTypes,
  AZURE_FUNCTION_APP_URL,
  BLOB_STORAGE_CONTAINER,
  CANNOT_START_YET_STATUS,
  CHECK_UPLOAD_METRIC_OPTIONS,
  clearReferer,
  COMBINED_CASE_APPLICANT_INFO_VALID_REFERRERS,
  COMBINED_CASE_BOUNDARY_VALID_REFERRERS,
  COMBINED_CASE_LEGAL_AGREEMENT_VALID_REFERRERS,
  COMBINED_CASE_METRIC_VALID_REFERRERS,
  COMPLETE_REGISTRATION_TASK_STATUS,
  confirmLandBoundaryOptions: confirmFileUploadOptions,
  confirmLegalAgreementOptions: confirmFileUploadOptions,
  confirmManagementPlanOptions: confirmFileUploadOptions,
  consentFileExt: developerConstants.consentFileExt,
  DEFAULT_REGISTRATION_TASK_STATUS,
  DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER,
  geospatialLandBoundaryFileExt: GEOSPATIAL_LEGAL_LAND_BOUNDARY_FILE_EXT,
  gridReferenceRegEx: GRID_REFERENCE_REGEX,
  IN_PROGRESS_REGISTRATION_TASK_STATUS,
  individualOrOrganisationTypes,
  LAND_APPLICANT_INFO_VALID_REFERRERS,
  landBoundaryFileExt: LEGAL_LAND_BOUNDARY_FILE_EXT,
  landBoundaryUploadTypes,
  LAND_BOUNDARY_VALID_REFERRERS,
  LAND_LEGAL_AGREEMENT_VALID_REFERRERS,
  LAND_METRIC_VALID_REFERRERS,
  lanOwnerFileExt: LAND_OWNERSHIP_FILE_EXT,
  LEGAL_AGREEMENT_DOCUMENTS,
  legalAgreementFileExt: LEGAL_AGREEMENT_FILE_EXT,
  LEGAL_AGREEMENT_TYPE_CONSERVATION,
  localLandChargeFileExt: LOCAL_LAND_CHARGE_FILE_EXT,
  managementPlanFileExt: LEGAL_AGREEMENT_FILE_EXT,
  metricFileExt: METRIC_FILE_EXT,
  minStartDates,
  MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED,
  NOT_STARTED_YET_STATUS,
  primaryPages,
  redisKeys,
  reusedRoutes,
  routes,
  setReferer,
  signInTypes,
  threatScreeningStatusValues,
  uploadErrors,
  uploadTypes,
  views,
  ...developerConstants.options,
  answerIdRoutes,
  answerIdClearRoutes
})
