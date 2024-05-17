import constants from '../../utils/constants.js'
import { validateBNGNumber } from '../../utils/helpers.js'
import wreck from '@hapi/wreck'

const checkBGS = async bgsNumber => {
  const { payload } = await wreck.get(`http://localhost:3000/test/api/gainsite/${bgsNumber}`, { json: true })
  console.log(payload)
}

const ID = '#bngNumber'

const handlers = {
  get: async (request, h) => {
    const bngNumber = request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
    return h.view(constants.views.DEVELOPER_BNG_NUMBER, {
      bngNumber
    })
  },
  post: async (request, h) => {
    const bngNumber = request.payload.bngNumber
    checkBGS(bngNumber)
    const error = validateBNGNumber(bngNumber, ID)
    if (error) {
      request.yar.clear(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
      return h.view(constants.views.DEVELOPER_BNG_NUMBER, {
        bngNumber,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, bngNumber)
      return h.redirect(request.yar.get(constants.redisKeys.DEVELOPER_REFERER, true) || constants.routes.DEVELOPER_UPLOAD_METRIC)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_BNG_NUMBER,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_BNG_NUMBER,
  handler: handlers.post
}]
