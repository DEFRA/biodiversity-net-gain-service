import constants from '../utils/constants.js'

const error = {
  method: 'GET',
  path: constants.routes.ERROR,
  handler: () => {
    throw new Error('test')
  }
}

export default error
