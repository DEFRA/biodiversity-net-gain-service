const CREDITS_UPLOAD_METRIC = '/credits/credits-metric-upload'
const CREDITS_CHECK_UPLOAD_METRIC = '/credits/credits-metric-upload-check'
const CREDITS_CONFIRM_DEV_DETAILS = '/credits/credits-development-location'

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
    CREDITS_CONFIRM_DEV_DETAILS
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
    unsupportedFileExt: 'Unsupported file extension'
  },
  creditsCheckUploadMetric: {
    NO,
    YES
  },
  creditsCheckDetails: {
    NO,
    YES
  }
}
