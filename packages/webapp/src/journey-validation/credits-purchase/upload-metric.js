import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import {
  routeDefinition,
  journeyStep,
  ANY
} from '../utils.js'

const UPLOAD_METRIC = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
  [
    creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION,
    creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_SIZE,
    creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_TYPE,
    creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DATA,
    creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_NAME
  ]
)

const CHECK_METRIC_FILE = routeDefinition(
  creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC,
  [creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_CHECKED]
)

const uploadMetricJourneys = [
  [
    journeyStep(
      UPLOAD_METRIC.startUrl,
      [
        ...UPLOAD_METRIC.sessionKeys,
        ...CHECK_METRIC_FILE.sessionKeys
      ],
      [ANY, ANY, ANY, ANY, ANY, 'yes']
    )
  ]
]

export {
  uploadMetricJourneys
}
