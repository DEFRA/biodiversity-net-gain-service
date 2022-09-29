import constants from '../utils/constants.js'

const confirmation = {
  method: 'GET',
  path: constants.routes.CONFIRMATION,
  handler: {
    view: constants.views.CONFIRMATION
  }
}

export default confirmation
