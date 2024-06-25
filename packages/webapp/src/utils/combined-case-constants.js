import constants from './constants.js'
import developerConstants from './developer-constants.js'

const { routes: { ADD_GRID_REFERENCE } } = constants
const { routes: { DEVELOPER_UPLOAD_METRIC } } = developerConstants

export const reusedRoutes = [
  ADD_GRID_REFERENCE,
  `/${DEVELOPER_UPLOAD_METRIC}`
]

export const baseUrl = '/combined'
