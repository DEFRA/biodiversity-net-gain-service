// Routes constants
const DEVELOPER_UPLOAD_METRIC = 'developer/upload-metric-file'
const DEVELOPER_CHECK_UPLOAD_METRIC = 'developer/check-metric-file'
const DEVELOPER_CONFIRM_DEV_DETAILS = 'developer/confirm-development-details'
const DEVELOPER_DOWNLOAD_METRIC_FILE = 'developer/download-metric-file'
const DEVELOPER_TASKLIST = 'developer/record-gains-task-list'
const DEVELOPER_ROUTING_REGISTER = 'developer/routing-register'
const DEVELOPER_ROUTING_RESULT = 'developer/routing-result'
const DEVELOPER_ROUTING_SOLD = 'developer/routing-sold'
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
const DEVELOPER_AGENT_ACTING_FOR_CLIENT = 'developer/agent-acting-for-client'
const DEVELOPER_IS_AGENT = 'developer-is-agent'
const DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS = 'developer/check-defra-account-details'
const DEVELOPER_LANDOWNER_OR_LEASEHOLDER = 'developer/landowner-or-leaseholder'
const DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE = 'developer/upload-consent-to-use-gain-site'
const DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION = 'developer/applying-individual-organisation'
const DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION = 'developer/client-individual-organisation'
const DEVELOPER_CLIENTS_NAME = 'developer/clients-name'
const DEVELOPER_CLIENTS_ORGANISATION_NAME = 'developer/clients-organisation-name'
const DEVELOPER_NEED_ADD_PERMISSION = 'developer/need-add-permission'
const DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION = 'developer/upload-written-authorisation'
const DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE = 'developer/check-written-authorisation-file'
const DEVELOPER_DOWNLOAD_WRITTEN_AUTHORISATION = 'developer/download-written-authorisation-file'
const DEVELOPER_DEFRA_ACCOUNT_NOT_LINKED = 'developer/defra-account-not-linked'
const DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS = 'developer/upload-consent-to-allocate-gains'
const DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE = 'developer/check-consent-file'
const DEVELOPER_PLANNING_DECISION_UPLOAD = 'developer/planning-decision-upload'

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
const DEVELOPER_ROUTING_REGISTER_VALUE = 'routing-register-value'
const DEVELOPER_WRITTEN_CONTENT_VALUE = 'developer-written-consent-value'
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
const DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED = 'developer-defra-account-details-confirmed'
const DEVELOPER_LANDOWNER_TYPE = 'developer-landowner-type'
const DEVELOPER_WRITTEN_AUTHORISATION_UPLOAD_TYPE = 'written-authorisation'
const DEVELOPER_WRITTEN_AUTHORISATION_LOCATION = 'written-authorisation-location'
const DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE = 'written-authorisation-file-size'
const DEVELOPER_WRITTEN_AUTHORISATION_FILE_TYPE = 'written-authorisation-file-type'
const DEVELOPER_WRITTEN_AUTHORISATION_CHECKED = 'written-authorisation-checked'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_UPLOAD_TYPE = 'consent-to-use-gain'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION = 'consent-to-use-gain-site-location'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE = 'consent-to-use-gain-site-file-siz'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_TYPE = 'consent-to-use-gain-site-file-type'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME = 'consent-to-use-gain-site-file-name'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_CHECKED = 'consent-to-use-gain-site-checked'
const DEVELOPER_PLANNING_DECISION_UPLOAD_TYPE = 'planning-decision'
const DEVELOPER_PLANNING_DECISION_FILE_LOCATION = 'planning-decision-location'
const DEVELOPER_PLANNING_DECISION_FILE_SIZE = 'planning-decision-file-siz'
const DEVELOPER_PLANNING_DECISION_FILE_TYPE = 'planning-decision-file-type'
const DEVELOPER_PLANNING_DECISION_FILE_NAME = 'planning-decision-file-name'
const DEVELOPER_PLANNING_DECISION_CHECKED = 'planning-decision-checked'

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

export default {
  routes: {
    DEVELOPER_UPLOAD_METRIC,
    DEVELOPER_CHECK_UPLOAD_METRIC,
    DEVELOPER_CONFIRM_DEV_DETAILS,
    DEVELOPER_DOWNLOAD_METRIC_FILE,
    DEVELOPER_TASKLIST,
    DEVELOPER_ROUTING_REGISTER,
    DEVELOPER_ROUTING_RESULT,
    DEVELOPER_ROUTING_SOLD,
    DEVELOPER_BNG_NUMBER,
    DEVELOPER_CHECK_ANSWERS,
    DEVELOPER_CONFIRM_OFF_SITE_GAIN,
    DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
    DEVELOPER_AGREEMENT_CHECK,
    DEVELOPER_DOWNLOAD_CONSENT_FILE,
    DEVELOPER_DEVELOPMENT_PROJECTS,
    DEVELOPER_CONTINUE_DEVELOPMENT_PROJECT,
    DEVELOPER_NEW_DEVELOPMENT_PROJECT,
    DEVELOPER_NEED_METRIC,
    DEVELOPER_AGENT_ACTING_FOR_CLIENT,
    DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS,
    DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
    DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE,
    DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
    DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION,
    DEVELOPER_CLIENTS_NAME,
    DEVELOPER_CLIENTS_ORGANISATION_NAME,
    DEVELOPER_NEED_ADD_PERMISSION,
    DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
    DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
    DEVELOPER_DOWNLOAD_WRITTEN_AUTHORISATION,
    DEVELOPER_DEFRA_ACCOUNT_NOT_LINKED,
    DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
    DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE,
    DEVELOPER_PLANNING_DECISION_UPLOAD
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
    DEVELOPER_ROUTING_REGISTER_VALUE,
    DEVELOPER_WRITTEN_CONTENT_VALUE,
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
    DEVELOPER_IS_AGENT,
    DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED,
    DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
    DEVELOPER_LANDOWNER_TYPE,
    DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION,
    DEVELOPER_CLIENTS_NAME,
    DEVELOPER_CLIENTS_ORGANISATION_NAME,
    DEVELOPER_WRITTEN_AUTHORISATION_LOCATION,
    DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE,
    DEVELOPER_WRITTEN_AUTHORISATION_FILE_TYPE,
    DEVELOPER_WRITTEN_AUTHORISATION_CHECKED,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_TYPE,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_CHECKED,
    DEVELOPER_PLANNING_DECISION_UPLOAD_TYPE,
    DEVELOPER_PLANNING_DECISION_FILE_LOCATION,
    DEVELOPER_PLANNING_DECISION_FILE_SIZE,
    DEVELOPER_PLANNING_DECISION_FILE_TYPE,
    DEVELOPER_PLANNING_DECISION_FILE_NAME,
    DEVELOPER_PLANNING_DECISION_CHECKED
  },
  uploadTypes: {
    DEVELOPER_METRIC_UPLOAD_TYPE,
    DEVELOPER_METRIC_EXTRACTION_UPLOAD_TYPE,
    DEVELOPER_CONSENT_UPLOAD_TYPE,
    DEVELOPER_WRITTEN_AUTHORISATION_UPLOAD_TYPE,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_UPLOAD_TYPE
  },
  options: {
    ROUTING_REGISTER_OPTIONS,
    offSiteGainTypes,
    DEFAULT_DEVELOPER_TASK_STATUS,
    IN_PROGRESS_DEVELOPER_TASK_STATUS,
    COMPLETE_DEVELOPER_TASK_STATUS
  },
  consentFileExt: CONSENT_FILE_EXT,
  setDeveloperReferer,
  clearDeveloperReferer
}
