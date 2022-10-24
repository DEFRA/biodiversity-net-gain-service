import constants from '../utils/constants.js'

const about = {
  method: 'GET',
  path: constants.routes.ABOUT,
  handler: {
    view: constants.views.ABOUT
  }
}

export default about
