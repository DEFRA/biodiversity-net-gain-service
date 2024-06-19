import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute,
  journeyStep,
  ANY
} from '../utils.js'

const BIODIVERSITY_NET_GAIN_NUMBER = routeDefinition(
  constants.routes.DEVELOPER_BNG_NUMBER,
  [constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER]
)

const METRIC_UPLOAD = routeDefinition(
  constants.routes.DEVELOPER_UPLOAD_METRIC,
  [
    constants.redisKeys.DEVELOPER_METRIC_LOCATION,
    constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE,
    constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE,
    constants.redisKeys.DEVELOPER_METRIC_DATA,
    constants.redisKeys.DEVELOPER_METRIC_FILE_NAME
  ]
)

const CHECK_METRIC = routeDefinition(
  constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC,
  [constants.redisKeys.METRIC_FILE_CHECKED]
)

const CONFIRM_DEV_HABITAT_DETAILS = routeDefinition(
  constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  [constants.redisKeys.DEVELOPER_OFF_SITE_GAIN_CONFIRMED]
)

const allocationInformationJourneys = [
  [
    journeyStep(
      BIODIVERSITY_NET_GAIN_NUMBER.startUrl,
      [
        ...BIODIVERSITY_NET_GAIN_NUMBER.sessionKeys,
        ...METRIC_UPLOAD.sessionKeys,
        ...CHECK_METRIC.sessionKeys
      ],
      [ANY, ANY, ANY, ANY, ANY, ANY, 'yes']
    ),
    journeyStepFromRoute(CONFIRM_DEV_HABITAT_DETAILS, [true])
  ]
]

export {
  allocationInformationJourneys
}
