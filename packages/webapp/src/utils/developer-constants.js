// Routes constants
const DEVELOPER_UPLOAD_METRIC = 'developer/upload-metric-file'
const DEVELOPER_CHECK_UPLOAD_METRIC = 'developer/check-metric-file'
const DEVELOPER_DOWNLOAD_METRIC_FILE = 'developer/download-metric-file'
const DEVELOPER_TASKLIST = 'developer/tasklist'
const DEVELOPER_BNG_NUMBER = 'developer/biodiversity-gain-site-number'
const DEVELOPER_CONFIRM_OFF_SITE_GAIN = 'developer/confirm-off-site-gain'
const DEVELOPER_DOWNLOAD_CONSENT_FILE = 'developer/download-consent-file'
const DEVELOPER_DOWNLOAD_CONSENT_TO_USE_GAIN_SITE_FILE = 'developer/download-consent-to-allocate-gains-file'
const DEVELOPER_DEVELOPMENT_PROJECTS = 'developer/development-projects'
const DEVELOPER_CONTINUE_DEVELOPMENT_PROJECT = 'developer/continue-development-project'
const DEVELOPER_NEW_DEVELOPMENT_PROJECT = 'developer/new-development-project'
const DEVELOPER_AGENT_ACTING_FOR_CLIENT = 'developer/agent-acting-for-client'
const DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS = 'developer/check-defra-account-details'
const DEVELOPER_LANDOWNER_OR_LEASEHOLDER = 'developer/landowner-or-leaseholder'
const DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION = 'developer/applying-individual-organisation'
const DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION = 'developer/client-individual-organisation'
const DEVELOPER_CLIENTS_NAME = 'developer/clients-name'
const DEVELOPER_CLIENTS_ORGANISATION_NAME = 'developer/clients-organisation-name'
const DEVELOPER_NEED_PROOF_OF_PERMISSION = 'developer/need-proof-of-permission'
const DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION = 'developer/upload-written-authorisation'
const DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE = 'developer/check-written-authorisation-file'
const DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE = 'developer/check-planning-decision-notice-file'
const DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE = 'developer/upload-planning-decision-notice'
const DEVELOPER_DOWNLOAD_WRITTEN_AUTHORISATION = 'developer/download-written-authorisation-file'
const DEVELOPER_DOWNLOAD_PLANNING_DECISION_FILE = 'developer/download-planning-decision-file'
const DEVELOPER_DEFRA_ACCOUNT_NOT_LINKED = 'developer/defra-account-not-linked'
const DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS = 'developer/upload-consent-to-allocate-gains'
const DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE = 'developer/check-consent-file'
const DEVELOPER_CHECK_AND_SUBMIT = 'developer/check-and-submit'
const DEVELOPER_CONFIRMATION = 'developer/application-submitted'
const DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION = 'developer/development-project-information'

// RedisKeys constants
const DEVELOPER_IS_AGENT = 'developer-is-agent'
const DEVELOPER_METRIC_DATA = 'developer-metric-data'
const DEV_DETAILS_CHECKED = 'dev-details-checked'
const DEVELOPER_METRIC_UPLOAD_TYPE = 'developer-metric-upload'
const DEVELOPER_METRIC_LOCATION = 'developer-upload-metric-file-location'
const DEVELOPER_ORIGINAL_METRIC_UPLOAD_LOCATION = 'developer-original-metric-upload-location'
const DEVELOPER_METRIC_FILE_NAME = 'developer-upload-metric-filename'
const DEVELOPER_METRIC_FILE_SIZE = 'developer-upload-metric-file-size'
const DEVELOPER_METRIC_FILE_TYPE = 'developer-upload-metric-file-type'
const DEVELOPER_FULL_NAME = 'developer-fullname'
const DEVELOPER_REFERER = 'developer-referer'
const DEVELOPER_EMAIL_VALUE = 'developer-email-value'
const DEVELOPER_WRITTEN_CONTENT_VALUE = 'developer-written-consent-value'
const BIODIVERSITY_NET_GAIN_NUMBER = 'biodiversity-net-gain-number'
const DEVELOPER_ADDITIONAL_EMAILS = 'developer-additional-emails'
const DEVELOPER_TASK_DETAILS = 'developer-task-details'
const DEVELOPER_APP_REFERENCE = 'developer-app-reference'
const DEVELOPER_ROLE_KEY = 'developer-role-key'
const DEVELOPER_DEFRA_ACCOUNT_DETAILS_CONFIRMED = 'developer-defra-account-details-confirmed'
const DEVELOPER_LANDOWNER_TYPE = 'developer-landowner-type'
const DEVELOPER_WRITTEN_AUTHORISATION_UPLOAD_TYPE = 'developer-written-authorisation'
const DEVELOPER_WRITTEN_AUTHORISATION_LOCATION = 'developer-written-authorisation-location'
const DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE = 'developer-written-authorisation-file-size'
const DEVELOPER_WRITTEN_AUTHORISATION_FILE_TYPE = 'developer-written-authorisation-file-type'
const DEVELOPER_WRITTEN_AUTHORISATION_FILE_NAME = 'developer-written-authorisation-file-name'
const DEVELOPER_WRITTEN_AUTHORISATION_CHECKED = 'developer-written-authorisation-checked'
const DEVELOPER_PLANNING_DECISION_NOTICE_UPLOAD_TYPE = 'developer-planning-decision-notice'
const DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION = 'developer-planning-decision-notice-location'
const DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE = 'developer-planning-decision-notice-file-size'
const DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE = 'developer-planning-decision-notice-file-type'
const DEVELOPER_PLANNING_DECISION_NOTICE_CHECKED = 'developer-planning-decision-notice-checked'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_UPLOAD_TYPE = 'developer-upload-consent'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION = 'developer-upload-consent-file-location'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE = 'developer-upload-consent-file-size'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_TYPE = 'developer-upload-consent-file-type'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME = 'developer-upload-consent-file-name'
const DEVELOPER_CONSENT_TO_USE_GAIN_SITE_CHECKED = 'developer-upload-consent-checked'
const DEVELOPER_OFF_SITE_GAIN_CONFIRMED = 'developer-off-site-gain-confirmed'
const DEVELOPER_PLANNING_AUTHORITY_LIST = 'developer-planning-authority-list'
const DEVELOPER_PLANNING_APPLICATION_REF = 'developer-planning-application-ref'
const DEVELOPER_DEVELOPMENT_NAME = 'developer-planning-development-name'
const DEVELOPER_PROOF_OF_PERMISSION_SEEN = 'developer-proof-of-permission-seen'
const DEVELOPER_APPLICATION_SUBMITTED = 'developer-application-submitted'
const DEVELOPER_METRIC_FILE_CHECKED = 'developer-metric-file-checked'

const setDeveloperReferer = [
  DEVELOPER_CHECK_AND_SUBMIT
]

const clearDeveloperReferer = [
  DEVELOPER_UPLOAD_METRIC,
  DEVELOPER_TASKLIST
]

const CONSENT_FILE_EXT = [
  '.doc',
  '.docx',
  '.pdf'
]

// ./Other constants
const DEFAULT_DEVELOPER_TASK_STATUS = 'NOT STARTED'
const IN_PROGRESS_DEVELOPER_TASK_STATUS = 'IN PROGRESS'
const COMPLETE_DEVELOPER_TASK_STATUS = 'COMPLETED'

export default {
  routes: {
    DEVELOPER_UPLOAD_METRIC,
    DEVELOPER_CHECK_UPLOAD_METRIC,
    DEVELOPER_DOWNLOAD_METRIC_FILE,
    DEVELOPER_TASKLIST,
    DEVELOPER_BNG_NUMBER,
    DEVELOPER_CONFIRM_OFF_SITE_GAIN,
    DEVELOPER_DOWNLOAD_CONSENT_FILE,
    DEVELOPER_DOWNLOAD_CONSENT_TO_USE_GAIN_SITE_FILE,
    DEVELOPER_DEVELOPMENT_PROJECTS,
    DEVELOPER_CONTINUE_DEVELOPMENT_PROJECT,
    DEVELOPER_NEW_DEVELOPMENT_PROJECT,
    DEVELOPER_AGENT_ACTING_FOR_CLIENT,
    DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS,
    DEVELOPER_LANDOWNER_OR_LEASEHOLDER,
    DEVELOPER_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
    DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION,
    DEVELOPER_CLIENTS_NAME,
    DEVELOPER_CLIENTS_ORGANISATION_NAME,
    DEVELOPER_NEED_PROOF_OF_PERMISSION,
    DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
    DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE,
    DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE,
    DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
    DEVELOPER_DOWNLOAD_WRITTEN_AUTHORISATION,
    DEVELOPER_DOWNLOAD_PLANNING_DECISION_FILE,
    DEVELOPER_DEFRA_ACCOUNT_NOT_LINKED,
    DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
    DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE,
    DEVELOPER_CHECK_AND_SUBMIT,
    DEVELOPER_CONFIRMATION,
    DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION
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
    DEVELOPER_WRITTEN_CONTENT_VALUE,
    BIODIVERSITY_NET_GAIN_NUMBER,
    DEVELOPER_ADDITIONAL_EMAILS,
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
    DEVELOPER_WRITTEN_AUTHORISATION_FILE_NAME,
    DEVELOPER_WRITTEN_AUTHORISATION_CHECKED,
    DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION,
    DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE,
    DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE,
    DEVELOPER_PLANNING_DECISION_NOTICE_CHECKED,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_TYPE,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_CHECKED,
    DEVELOPER_OFF_SITE_GAIN_CONFIRMED,
    DEVELOPER_PLANNING_AUTHORITY_LIST,
    DEVELOPER_PLANNING_APPLICATION_REF,
    DEVELOPER_DEVELOPMENT_NAME,
    DEVELOPER_PROOF_OF_PERMISSION_SEEN,
    DEVELOPER_APPLICATION_SUBMITTED,
    DEVELOPER_METRIC_FILE_CHECKED
  },
  uploadTypes: {
    DEVELOPER_METRIC_UPLOAD_TYPE,
    DEVELOPER_WRITTEN_AUTHORISATION_UPLOAD_TYPE,
    DEVELOPER_PLANNING_DECISION_NOTICE_UPLOAD_TYPE,
    DEVELOPER_CONSENT_TO_USE_GAIN_SITE_UPLOAD_TYPE
  },
  options: {
    DEFAULT_DEVELOPER_TASK_STATUS,
    IN_PROGRESS_DEVELOPER_TASK_STATUS,
    COMPLETE_DEVELOPER_TASK_STATUS
  },
  consentFileExt: CONSENT_FILE_EXT,
  setDeveloperReferer,
  clearDeveloperReferer
}
