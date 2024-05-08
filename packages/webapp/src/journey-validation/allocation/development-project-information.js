import developerConstants from '../../utils/developer-constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const ADD_DEVELOPMENT_PROJECT_INFORMATION = routeDefinition(
  developerConstants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  [
    developerConstants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST
  ]
)

const addDevelopmentProjectInformationJourneys = [
  [
    journeyStepFromRoute(ADD_DEVELOPMENT_PROJECT_INFORMATION)
  ]
]

export {
  addDevelopmentProjectInformationJourneys
}
