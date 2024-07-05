import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStep,
} from '../utils.js'

const METRIC_UPLOAD = routeDefinition(
  constants.routes.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC,
  [
    constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE
  ]
)

const matchAvailableHabitatsJourneys = [
  [
    journeyStep(
      METRIC_UPLOAD.startUrl,
      [
        ...METRIC_UPLOAD.sessionKeys
      ],
      ['true']
    )
  ]
]

export {
  matchAvailableHabitatsJourneys
}
