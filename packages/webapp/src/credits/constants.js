import creditConstants from './credit-constants.js'

const CREDITS_ESTIMATION_PATH = '/credits-estimation'

const uploadErrors = {
  uploadFailure: 'The selected file could not be uploaded -- try again',
  noFile: 'Non-file received',
  emptyFile: 'Empty file',
  maximumFileSizeExceeded: 'Maxiumum file size exceeded',
  threatDetected: 'The selected file contains a virus',
  unsupportedFileExt: 'Unsupported file extension'
}
const routes = {
  ...creditConstants.routes,
  ESTIMATOR_CREDITS_COST: '/credits-estimation/credits-cost',
  ESTIMATOR_CREDITS_TIER: '/credits-estimation/credits-tier'
}

const views = Object.fromEntries(Object.entries(routes).map(([k, v]) => [k, v.substring(1)]))

export default {
  ...creditConstants,
  CREDITS_ESTIMATION_PATH,
  routes,
  views,
  uploadErrors,
  redisKeys: {
    ...creditConstants.redisKeys,
    ESTIMATOR_CREDITS_CALCULATION: 'estimator-credits-calculation'
  }
}
