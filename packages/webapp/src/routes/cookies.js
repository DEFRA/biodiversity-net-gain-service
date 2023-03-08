import constants from '../utils/constants.js'

const cookies = {
  method: 'GET',
  path: constants.routes.COOKIES,
  handler: {
    view: constants.views.COOKIES
  }
}

export default cookies
