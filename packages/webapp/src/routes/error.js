import constants from '../utils/constants.js'

const error = {
  method: 'GET',
  options: {
    auth: false
  },
  path: constants.routes.ERROR,
  handler: () => {
    throw new Error('test')
  }
}

export default error
