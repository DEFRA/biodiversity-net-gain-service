import commonRouteConstants from './common-route-constants.js'

// Routes constants
const DEVELOPER_UPLOAD_METRIC = 'developer/upload-metric-file'
const DEVELOPER_CHECK_UPLOAD_METRIC = 'developer/check-metric-file'
const DEVELOPER_CONFIRM_DEV_DETAILS = 'developer/confirm-development-details'
const DEVELOPER_DOWNLOAD_METRIC_FILE = 'developer/download-metric-file'
const DEVELOPER_DETAILS_NAME = 'developer/details-name'
const DEVELOPER_DETAILS_EMAIL = 'developer/details-email'
const DEVELOPER_DETAILS_EMAIL_CONFIRM = 'developer/details-email-confirm'
const DEVELOPER_DETAILS_CONFIRM = 'developer/details-confirm'
const DEVELOPER_TASKLIST = 'developer/tasklist'
const DEVELOPER_ROUTING_REGISTER = 'developer/routing-register'
const DEVELOPER_ROUTING_RESULT = 'developer/routing-result'
const DEVELOPER_ROUTING_SOLD = 'developer/routing-sold'
const DEVELOPER_ELIGIBILITY_ENGLAND = 'developer/eligibility-england'
const DEVELOPER_ELIGIBILITY_LO_CONSENT = 'developer/eligibility-landowner-consent'
const DEVELOPER_ELIGIBILITY_NO = 'developer/eligibility-england-no'
const DEVELOPER_ELIGIBILITY_METRIC = 'developer/eligibility-metric'
const DEVELOPER_ELIGIBILITY_RESULT = 'developer/eligibility-results'
const DEVELOPER_BNG_NUMBER = 'developer/biodiversity-gain-site-number'
const DEVELOPER_CHECK_ANSWERS = 'developer/check-answers'
const DEVELOPER_CONFIRM_OFF_SITE_GAIN = 'developer/confirm-off-site-gain'
const DEVELOPER_CONSENT_AGREEMENT_UPLOAD = 'developer/consent-agreement-upload'
const DEVELOPER_AGREEMENT_CHECK = 'developer/consent-agreement-check'
const DEVELOPER_DOWNLOAD_CONSENT_FILE = 'developer/download-consent-file'
const DEVELOPER_DEVELOPMENT_PROJECTS = 'developer/development-projects'
const DEVELOPER_CONTINUE_DEVELOPMENT_PROJECT = 'developer/continue-development-project'
const DEVELOPER_NEW_DEVELOPMENT_PROJECT = 'developer/new-development-project'
const DEVELOPER_NEED_METRIC = 'developer/need-metric'
const DEVELOPER_AGENT_ACTING_FOR_CLIENT = `/${commonRouteConstants.AGENT_ACTING_FOR_CLIENT.replace('applicant', 'developer')}`
// ./Routes constants

// RedisKeys constants
const DEVELOPER_METRIC_DATA = 'developer-metric-data'
const DEV_DETAILS_CHECKED = 'dev-details-checked'
const DEVELOPER_METRIC_LOCATION = 'developer-metric-file-location'
const DEVELOPER_ORIGINAL_METRIC_UPLOAD_LOCATION = 'developer-original-metric-upload-location'
const DEVELOPER_METRIC_FILE_NAME = 'developer-metric-filename'
const DEVELOPER_METRIC_FILE_SIZE = 'developer-metric-filesize'
const DEVELOPER_METRIC_FILE_TYPE = 'developer-metric-filetype'
const DEVELOPER_FULL_NAME = 'developer-fullname'
const DEVELOPER_REFERER = 'developer-referer'
const DEVELOPER_EMAIL_VALUE = 'developer-email-value'
const DEVELOPER_CONFIRM_EMAIL = 'developer-confirm-email'
const DEVELOPER_ROUTING_REGISTER_VALUE = 'routing-register-value'
const DEVELOPER_ELIGIBILITY_ENGLAND_VALUE = 'eligibility-value'
const DEVELOPER_WRITTEN_CONTENT_VALUE = 'developer-written-consent-value'
const DEVELOPER_ELIGIBILITY_METRIC_VALUE = 'developer-eligibility-metric-value'
const BIODIVERSITY_NET_GAIN_NUMBER = 'biodiversity-net-gain-number'
const DEVELOPER_ADDITIONAL_EMAILS = 'developer-additional-emails'
const CONFIRM_OFFSITE_GAIN_CHECKED = 'offsite-details-checked'
const DEVELOPER_ORIGINAL_CONSENT_LOCATION = 'developer-original-consent-location'
const DEVELOPER_CONSENT_FILE_LOCATION = 'developer-consent-file-location'
const DEVELOPER_CONSENT_FILE_NAME = 'developer-consent-file-name'
const DEVELOPER_CONSENT_FILE_SIZE = 'developer-consent-file-size'
const DEVELOPER_CONSENT_FILE_TYPE = 'developer-consent-file-type'
const DEVELOPER_CONSENT_ANSWER = 'developer-consent-answer'
const DEVELOPER_TASK_DETAILS = 'developer-task-details'
const DEVELOPER_APP_REFERENCE = 'developer-app-reference'
const DEVELOPER_ROLE_KEY = 'developer-role-key'
const DEVELOPER_IS_AGENT = 'developer-is-agent'
// ./RedisKeys constants
const HABITAT = 'HABITAT'
const HEDGEROW = 'HEDGEROW'

const offSiteGainTypes = {
  HABITAT,
  HEDGEROW
}

const setDeveloperReferer = [
  DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  DEVELOPER_AGREEMENT_CHECK,
  DEVELOPER_CHECK_ANSWERS
]
const clearDeveloperReferer = [
  DEVELOPER_UPLOAD_METRIC,
  DEVELOPER_TASKLIST
]
// Other constants
const DEVELOPER_METRIC_UPLOAD_TYPE = 'developer-metric-upload'
const DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE = 'developer-metric-extraction'
const DEVELOPER_CONSENT_UPLOAD_TYPE = 'developer-upload-consent'
const CONSENT_FILE_EXT = [
  '.doc',
  '.docx',
  '.pdf'
]
// ./Other constants
const DEFAULT_DEVELOPER_TASK_STATUS = 'NOT STARTED'
const IN_PROGRESS_DEVELOPER_TASK_STATUS = 'IN PROGRESS'
const COMPLETE_DEVELOPER_TASK_STATUS = 'COMPLETED'

const ROUTING_REGISTER_OPTIONS = {
  REGISTER: 'register-gain-site',
  RECORD: 'record-off-site'
}

const developerEligibilityHTML = {
  [DEVELOPER_WRITTEN_CONTENT_VALUE]: '<li>written consent from the landowner of the biodiversity gain site</li>',
  [DEVELOPER_ELIGIBILITY_METRIC_VALUE]: '<li>a completed Biodiversity Metric file 4.1 for the site</li>'
}

// Route definitions used by more than one journey need to be registered using ./constants.js without reference to
// associated journey specific route constants. As such, route constants associated with common route definitions
// need to be differentiated from standard route constants. Without differentiation, route registration will attempt
// to locate route definitions that do not exist.

// EXAMPLE
// Requests to /land/agent-acting-for-client and /developer/agent-acting-for-client are both processed by the common route
// definition located at ../routes/applicant/agent-acting-for-client.js. Journey specific route definition files do not exist
// and no attempt should be made to register them accordingly. If DEVELOPER_AGENT_ACTING_FOR_CLIENT was defined in routes rather
// than commmonRoutes, server startup would attempt to register a route based on the non-existent file
// ../routes/developer/agent-acting-for-client.js.
export default {
  commonRoutes: {
    DEVELOPER_AGENT_ACTING_FOR_CLIENT
  },
  routes: {
    DEVELOPER_UPLOAD_METRIC,
    DEVELOPER_CHECK_UPLOAD_METRIC,
    DEVELOPER_CONFIRM_DEV_DETAILS,
    DEVELOPER_DOWNLOAD_METRIC_FILE,
    DEVELOPER_DETAILS_NAME,
    DEVELOPER_DETAILS_EMAIL,
    DEVELOPER_DETAILS_EMAIL_CONFIRM,
    DEVELOPER_DETAILS_CONFIRM,
    DEVELOPER_TASKLIST,
    DEVELOPER_ROUTING_REGISTER,
    DEVELOPER_ROUTING_RESULT,
    DEVELOPER_ROUTING_SOLD,
    DEVELOPER_ELIGIBILITY_ENGLAND,
    DEVELOPER_ELIGIBILITY_LO_CONSENT,
    DEVELOPER_ELIGIBILITY_NO,
    DEVELOPER_ELIGIBILITY_METRIC,
    DEVELOPER_ELIGIBILITY_RESULT,
    DEVELOPER_BNG_NUMBER,
    DEVELOPER_CHECK_ANSWERS,
    DEVELOPER_CONFIRM_OFF_SITE_GAIN,
    DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
    DEVELOPER_AGREEMENT_CHECK,
    DEVELOPER_DOWNLOAD_CONSENT_FILE,
    DEVELOPER_DEVELOPMENT_PROJECTS,
    DEVELOPER_CONTINUE_DEVELOPMENT_PROJECT,
    DEVELOPER_NEW_DEVELOPMENT_PROJECT,
    DEVELOPER_NEED_METRIC
  },
  redisKeys: {
    DEVELOPER_METRIC_DATA,
    DEV_DETAILS_CHECKED,
    DEVELOPER_METRIC_LOCATION,
    DEVELOPER_ORIGINAL_METRIC_UPLOAD_LOCATION,
    DEVELOPER_METRIC_FILE_NAME,
    DEVELOPER_METRIC_FILE_SIZE,
    DEVELOPER_METRIC_FILE_TYPE,
    DEVELOPER_FULL_NAME,
    DEVELOPER_REFERER,
    DEVELOPER_EMAIL_VALUE,
    DEVELOPER_CONFIRM_EMAIL,
    DEVELOPER_ROUTING_REGISTER_VALUE,
    DEVELOPER_ELIGIBILITY_ENGLAND_VALUE,
    DEVELOPER_WRITTEN_CONTENT_VALUE,
    DEVELOPER_ELIGIBILITY_METRIC_VALUE,
    BIODIVERSITY_NET_GAIN_NUMBER,
    DEVELOPER_ADDITIONAL_EMAILS,
    CONFIRM_OFFSITE_GAIN_CHECKED,
    DEVELOPER_ORIGINAL_CONSENT_LOCATION,
    DEVELOPER_CONSENT_FILE_LOCATION,
    DEVELOPER_CONSENT_FILE_NAME,
    DEVELOPER_CONSENT_FILE_SIZE,
    DEVELOPER_CONSENT_FILE_TYPE,
    DEVELOPER_CONSENT_ANSWER,
    DEVELOPER_TASK_DETAILS,
    DEVELOPER_APP_REFERENCE,
    DEVELOPER_ROLE_KEY,
    DEVELOPER_IS_AGENT
  },
  uploadTypes: {
    DEVELOPER_METRIC_UPLOAD_TYPE,
    DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE,
    DEVELOPER_CONSENT_UPLOAD_TYPE
  },
  options: {
    ROUTING_REGISTER_OPTIONS,
    developerEligibilityHTML,
    offSiteGainTypes,
    DEFAULT_DEVELOPER_TASK_STATUS,
    IN_PROGRESS_DEVELOPER_TASK_STATUS,
    COMPLETE_DEVELOPER_TASK_STATUS
  },
  consentFileExt: CONSENT_FILE_EXT,
  setDeveloperReferer,
  clearDeveloperReferer
}
