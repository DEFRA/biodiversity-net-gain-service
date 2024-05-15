import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const ADD_DEVELOPMENT_PROJECT_INFORMATION = routeDefinition(
  constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  [
    constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST
  ]
)

console.log(ADD_DEVELOPMENT_PROJECT_INFORMATION)

const addDevelopmentProjectInformationJourneys = [
  [
    journeyStepFromRoute(ADD_DEVELOPMENT_PROJECT_INFORMATION)
  ]
]

export {
  addDevelopmentProjectInformationJourneys
}
