// Routes constants
const CREDITS_UPLOAD_METRIC = 'credits-purchase/credits-metric-upload'
const CREDITS_CHECK_UPLOAD_METRIC = 'credits-purchase/credits-metric-upload-check'
const CREDITS_CONFIRM_DEV_DETAILS = 'credits-purchase/credits-development-location'
const CREDITS_DOWNLOAD_METRIC_FILE = 'credits-purchase/credits-download-metric'
const CREDITS_INDIVIDUAL_OR_ORG = 'credits-purchase/credits-individual-or-organisation'
const CREDITS_APPLICANT_CONFIRM = 'credits-purchase/credits-applicant-details-confirm'
const CREDITS_DEFRA_ACCOUNT_NOT_LINKED = 'credits-purchase/defra-account-not-linked'
// ./Routes constants

// RedisKeys constants
const CREDITS_METRIC_UPLOAD_TYPE = 'credits-metric-upload'
const CREDITS_TERMS_AND_CONDITIONS = 'estimator-credits-consent'
const CREDITS_METRIC_LOCATION = 'credits-metric-file-location'
const CREDITS_METRIC_FILE_SIZE = 'credits-metric-filesize'
const CREDITS_METRIC_FILE_TYPE = 'credits-metric-filetype'
const CREDITS_METRIC_DATA = 'credits-metric-data'
const CREDITS_METRIC_FILE_NAME = 'credits-metric-filename'
const METRIC_FILE_CHECKED = 'metric-file-checked'
const CREDITS_USER_TYPE = 'credits-user-type'
// ./RedisKeys constants

// Other constants
const NO = 'no'
const YES = 'yes'
// ./Other constants

export default {
  routes: {
    CREDITS_UPLOAD_METRIC,
    CREDITS_CHECK_UPLOAD_METRIC,
    CREDITS_CONFIRM_DEV_DETAILS,
    CREDITS_DOWNLOAD_METRIC_FILE,
    CREDITS_INDIVIDUAL_OR_ORG,
    CREDITS_APPLICANT_CONFIRM,
    CREDITS_DEFRA_ACCOUNT_NOT_LINKED
  },
  redisKeys: {
    CREDITS_TERMS_AND_CONDITIONS,
    CREDITS_METRIC_LOCATION,
    CREDITS_METRIC_FILE_SIZE,
    CREDITS_METRIC_FILE_TYPE,
    CREDITS_METRIC_DATA,
    CREDITS_METRIC_FILE_NAME,
    METRIC_FILE_CHECKED,
    CREDITS_USER_TYPE
  },
  uploadTypes: {
    CREDITS_METRIC_UPLOAD_TYPE
  },
  metricFileExt: [
    '.xlsm',
    '.xlsx'
  ],
  uploadErrors: {
    uploadFailure: 'The selected file could not be uploaded -- try again',
    noFile: 'Non-file received',
    emptyFile: 'Empty file',
    maximumFileSizeExceeded: 'Maxiumum file size exceeded',
    threatDetected: 'The selected file contains a virus',
    malwareScanFailed: 'File malware scan failed',
    unsupportedFileExt: 'Unsupported file extension',
    noFileScanResponse: 'Timed out awaiting anti virus scan result'
  },
  options: {
    creditsCheckUploadMetric: {
      NO,
      YES
    },
    creditsCheckDetails: {
      NO,
      YES
    }
  },
  BLOB_STORAGE_CONTAINER: 'customer-uploads'
}
