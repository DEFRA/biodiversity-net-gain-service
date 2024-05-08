import constants from '../../utils/constants.js'
import {
  routeDefinition,
  journeyStepFromRoute
} from '../utils.js'

const BIODIVERSITY_NET_GAIN_NUMBER = routeDefinition(
  constants.routes.DEVELOPER_BNG_NUMBER,
  [constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER]
)

const bngNumberJourneys = [
  [
    journeyStepFromRoute(BIODIVERSITY_NET_GAIN_NUMBER)
  ]
]

export {
  bngNumberJourneys
}
