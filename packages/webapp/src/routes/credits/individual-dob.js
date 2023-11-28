import constants from '../../utils/constants.js'
import { dateClasses } from '../../utils/helpers.js'

const individualDob = {
  method: 'GET',
  path: constants.routes.CREDITS_INDIVIDUAL_DOB,
  handler: (_request, h) => {
    return h.view(constants.views.CREDITS_INDIVIDUAL_DOB, { dateClasses })
  }
}

export default individualDob
