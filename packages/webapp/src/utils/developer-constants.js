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
const DEVELOPER_CONSENT_AGREEMENT_UPLOAD = 'developer/consent-agreement-upload'
const DEVELOPER_AGREEMENT_CHECK = 'developer/consent-agreement-check'
const DEVELOPER_DOWNLOAD_CONSENT_FILE = 'developer/download-consent-file'
// ./Routes constants

// RedisKeys constants
const DEVELOPER_METRIC_DATA = 'developer-metric-data'
const DEV_DETAILS_CHECKED = 'dev-details-checked'
const DEVELOPER_METRIC_LOCATION = 'developer-metric-file-location'
const DEVELOPER_ORIGINAL_METRIC_UPLOAD_LOCATION = 'developer-original-metric-upload-location'
const DEVELOPER_METRIC_FILE_NAME = 'metric_filename'
const DEVELOPER_METRIC_FILE_SIZE = 'metric_filesize'
const DEVELOPER_METRIC_FILE_TYPE = 'metric_filetype'
const DEVELOPER_FULL_NAME = 'developer-fullname'
const DEVELOPER_REFERER = 'developer-referer'
const DEVELOPER_EMAIL_VALUE = 'developer-email-value'
const DEVELOPER_CONFIRM_EMAIL = 'developer-confirm-email'
const DEVELOPER_ROUTING_REGISTER_VALUE = 'routing-register-value'
const DEVELOPER_ELIGIBILITY_ENGLAND_VALUE = 'eligibility-value'
const DEVELOPER_WRITTEN_CONTENT_VALUE = 'developer-written-consent-value'
const DEVELOPER_ELIGIBILITY_METRIC_VALUE = 'developer-eligibility-metric-value'
const BIODIVERSITY_NET_GAIN_NUMBER = 'biodiversity-net-gain-number'
const DEVELOPER_ORIGINAL_CONSENT_LOCATION = 'developer-original-consent-location'
const DEVELOPER_CONSENT_FILE_LOCATION = 'developer-consent-file-location'
const DEVELOPER_CONSENT_FILE_NAME = 'developer-consent-file-name'
const DEVELOPER_CONSENT_FILE_SIZE = 'developer-consent-file-size'
const DEVELOPER_CONSENT_FILE_TYPE = 'developer-consent-file-type'
// ./RedisKeys constants

// Other constants
const DEVELOPER_METRIC_UPLOAD_TYPE = 'developer-upload-metric'
const DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE = 'developer-metric-extraction'
const DEVELOPER_CONSENT_UPLOAD_TYPE = 'developer-upload-consent'
const CONSENT_FILE_EXT = [
  '.doc',
  '.docx',
  '.pdf'
]
// ./Other constants

const ROUTING_REGISTER_OPTIONS = {
  REGISTER: 'register-gain-site',
  RECORD: 'record-off-site'
}

const developerEligibilityHTML = {
  [DEVELOPER_WRITTEN_CONTENT_VALUE]: '<li>written consent from the landowner of the biodiversity gain site</li>',
  [DEVELOPER_ELIGIBILITY_METRIC_VALUE]: '<li>a completed Biodiversity Metric file 4.0 for the site</li>'
}

export default {
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
    DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
    DEVELOPER_AGREEMENT_CHECK,
    DEVELOPER_DOWNLOAD_CONSENT_FILE
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
    DEVELOPER_ORIGINAL_CONSENT_LOCATION,
    DEVELOPER_CONSENT_FILE_LOCATION,
    DEVELOPER_CONSENT_FILE_NAME,
    DEVELOPER_CONSENT_FILE_SIZE,
    DEVELOPER_CONSENT_FILE_TYPE
  },
  uploadTypes: {
    DEVELOPER_METRIC_UPLOAD_TYPE,
    DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE,
    DEVELOPER_CONSENT_UPLOAD_TYPE
  },
  options: {
    ROUTING_REGISTER_OPTIONS,
    developerEligibilityHTML
  },
  consentFileExt: CONSENT_FILE_EXT
}
