import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'

const ADD_DEVELOPMENT_PROJECT_INFORMATION = routeDefinition(
  constants.routes.DEVELOPER_DEVELOPMENT_PROJECT_INFORMATION,
  [
    constants.redisKeys.DEVELOPER_PLANNING_AUTHORITY_LIST
  ],
  (session) => {
    const referrerUrl = getValidReferrerUrl(session, ['/developer/check-and-submit', 'developer/tasklist'])
    return referrerUrl || constants.routes.DEVELOPER_TASKLIST
  }
)

const addDevelopmentProjectInformationJourneys = [
  [
    journeyStepFromRoute(ADD_DEVELOPMENT_PROJECT_INFORMATION)
  ]
]

const addDevelopmentProjectInformationJourneysRouteDefinitions = [
  ADD_DEVELOPMENT_PROJECT_INFORMATION
]

export {
  addDevelopmentProjectInformationJourneys,
  addDevelopmentProjectInformationJourneysRouteDefinitions
}
