import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const CONFIRM_DEV_HABITAT_DETAILS = routeDefinition(
  constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  [constants.redisKeys.CONFIRM_OFFSITE_GAIN_CHECKED]
)

const confirmDevelopmentHabitatDetailsJourneys = [
  [
    journeyStepFromRoute(CONFIRM_DEV_HABITAT_DETAILS)
  ]
]

export {
  confirmDevelopmentHabitatDetailsJourneys
}
