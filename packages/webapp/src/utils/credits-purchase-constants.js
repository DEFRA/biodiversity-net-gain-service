const INDIVIDUAL = 'individual'
const ORGANISATION = 'organisation'
const applicantTypes = {
  INDIVIDUAL,
  ORGANISATION
}

const routes = {
  CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS: '/credits-purchase/check-defra-account-details',
  CREDITS_PURCHASE_CONFIRMATION: '/credits-purchase/application-submitted',
  CREDITS_PURCHASE_APPLICATION_LIST: '/credits-purchase/check-statutory-biodiversity-credits',
  CREDITS_PURCHASE_NEW_PURCHASE: '/credits-purchase/new-purchase',
  CREDITS_PURCHASE_CONTINUE_PURCHASE: '/credits-purchase/continue-purchase',
  CREDITS_PURCHASE_MIDDLE_NAME: '/credits-purchase/middle-name',
  CREDITS_PURCHASE_DATE_OF_BIRTH: '/credits-purchase/date-of-birth',
  CREDITS_PURCHASE_NATIONALITY: '/credits-purchase/nationality',
  CREDITS_PURCHASE_TERMS_AND_CONDITIONS: '/credits-purchase/confirm-terms-conditions',
  CREDITS_PURCHASE_CHECK_YOUR_ANSWERS: '/credits-purchase/check-and-submit',
  CREDITS_PURCHASE_CREDITS_SELECTION: '/credits-purchase/add-statutory-biodiversity-credits',
  CREDITS_PURCHASE_CREDITS_COST: '/credits-purchase/estimated-cost-statutory-biodiversity-credits',
  CREDITS_PURCHASE_TASK_LIST: '/credits-purchase/buy-statutory-biodiversity-credits',
  CREDITS_PURCHASE_INDIVIDUAL_OR_ORG: '/credits-purchase/purchasing-individual-organisation',
  CREDITS_PURCHASE_UPLOAD_METRIC: '/credits-purchase/upload-metric-file',
  CREDITS_PURCHASE_CHECK_UPLOAD_METRIC: '/credits-purchase/check-metric-file',
  CREDITS_PURCHASE_CONFIRM_DEV_DETAILS: '/credits-purchase/confirm-development-details',
  CREDITS_PURCHASE_DOWNLOAD_METRIC_FILE: '/credits-purchase/credits-download-metric',
  CREDITS_PURCHASE_DEFRA_ACCOUNT_NOT_LINKED: '/credits-purchase/defra-account-not-linked',
  CREDITS_PURCHASE_CHECK_PURCHASE_ORDER: '/credits-purchase/check-purchase-order'
}

const views = Object.fromEntries(
  Object.entries(routes).map(([k, v]) => [k, v.substring(1)])
)

const redisKeys = {
  CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED: 'credits-purchase-defra-account-details-confirmed',
  CREDITS_PURCHASE_APPLICATION_REFERENCE: 'credits-purchase-application-reference',
  CREDITS_PURCHASE_MIDDLE_NAME: 'credits-purchase-middle-name',
  CREDITS_PURCHASE_DATE_OF_BIRTH: 'credits-purchase-date-of-birth',
  CREDITS_PURCHASE_NATIONALITY: 'credits-purchase-nationality-key',
  CREDITS_PURCHASE_TERMS_AND_CONDITIONS_CONFIRMED: 'credits-purchase-consent',
  CREDITS_PURCHASE_COST_CALCULATION: 'credits-purchase-cost-calculation',
  CREDITS_PURCHASE_METRIC_UPLOAD_TYPE: 'credits-purchase-metric-upload',
  CREDITS_PURCHASE_METRIC_LOCATION: 'credits-purchase-metric-file-location',
  CREDITS_PURCHASE_METRIC_FILE_SIZE: 'credits-purchase-metric-filesize',
  CREDITS_PURCHASE_METRIC_FILE_TYPE: 'credits-purchase-metric-file-type',
  CREDITS_PURCHASE_METRIC_DATA: 'credits-purchase-metric-data',
  CREDITS_PURCHASE_METRIC_FILE_NAME: 'credits-purchase-metric-filename',
  CREDITS_PURCHASE_METRIC_FILE_CHECKED: 'credits-purchase-metric-file-checked',
  CREDITS_PURCHASE_METRIC_DETAILS_CONFIRMED: 'credits-purchase-metric-details-confirmed',
  CREDITS_PURCHASE_USER_TYPE: 'credits-purchase-user-type',
  CREDITS_PURCHASE_PURCHASE_ORDER_USED: 'credits-purchase-purchase-order-used',
  CREDITS_PURCHASE_PURCHASE_ORDER_NUMBER: 'credits-purchase-purchase-order-number',
  REFERER: 'referer'
}

const NO = 'no'
const YES = 'yes'

export default {
  routes,
  views,
  redisKeys,
  applicantTypes,
  creditsCheckUploadMetric: {
    NO,
    YES
  },
  creditsCheckDetails: {
    NO,
    YES
  },
  uploadTypes: {
    CREDITS_PURCHASE_METRIC_UPLOAD_TYPE: 'credits-metric-upload'
  },
  setCreditReferer: [
    'credits-purchase/check-and-submit'
  ],
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
  BLOB_STORAGE_CONTAINER: 'customer-uploads'
}
