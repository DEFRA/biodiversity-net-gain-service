const CREDITS_UPLOAD_METRIC = '/credits/credits-metric-upload'
const CREDITS_CHECK_UPLOAD_METRIC = '/credits/credits-metric-upload-check'
const CREDITS_CONFIRM_DEV_DETAILS = '/credits/credits-development-location'
const CREDITS_DOWNLOAD_METRIC_FILE = '/credits/credits-download-metric'

const CREDITS_METRIC_UPLOAD_TYPE = 'credits-metric-upload'

const NO = 'no'
const YES = 'yes'

export default {
  redisKeys: {
    CREDITS_TERMS_AND_CONDITIONS: 'estimator-credits-consent',
    CREDITS_METRIC_LOCATION: 'credits-metric-file-location',
    CREDITS_METRIC_FILE_SIZE: 'credits-metric-filesize',
    CREDITS_METRIC_FILE_TYPE: 'credits-metric-filetype',
    CREDITS_METRIC_DATA: 'credits-metric-data',
    CREDITS_METRIC_FILE_NAME: 'credits-metric-filename',
    METRIC_FILE_CHECKED: 'metric-file-checked'
  },
  routes: {
    CREDITS_UPLOAD_METRIC,
    CREDITS_CHECK_UPLOAD_METRIC,
    CREDITS_CONFIRM_DEV_DETAILS,
    CREDITS_DOWNLOAD_METRIC_FILE
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
  creditsCheckUploadMetric: {
    NO,
    YES
  },
  creditsCheckDetails: {
    NO,
    YES
  },
  applicationTypes: {
    CREDITS: 'Credits'
  },
  BLOB_STORAGE_CONTAINER: 'customer-uploads'
}
