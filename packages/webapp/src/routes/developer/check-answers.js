import constants from '../../utils/constants.js'
import developerApplication from '../../utils/developerApplication.js'
import {
  listArray,
  boolToYesNo,
  dateToString,
  hideClass
} from '../../utils/helpers.js'
import { logger } from 'defra-logging-facade'

const handlers = {
  get: async (request, h) => {
    logger.info('Developer JSON payload for powerApp', developerApplication(request.yar).developerAllocation)
    return h.view(constants.views.DEVELOPER_CHECK_ANSWERS, {
      developerApplication: developerApplication(request.yar).developerAllocation,
      ...getContext(request)
    })
  }
}

const getContext = request => {
  return {
    listArray,
    boolToYesNo,
    dateToString,
    hideClass,
    routes: constants.routes
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_ANSWERS,
  handler: handlers.get
}]
