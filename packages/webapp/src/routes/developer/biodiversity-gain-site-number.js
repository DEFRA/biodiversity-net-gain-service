import constants from '../../utils/constants.js'
import { validateBNGNumber } from '../../utils/helpers.js'
import { BACKEND_API } from '../../utils/config.js'
import wreck from '@hapi/wreck'

const getErrorMessage = status => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'This gain site registration is not complete - wait until you have confirmation.'
    case 'rejected':
      return 'This reference is for a rejected application - enter a reference for an approved gain site.'
    case 'removed':
    case 'internally-removed':
      return 'This reference is for a gain site which is no longer registered.'
    case 'inactive':
      return 'This reference is for a gain site which has been withdrawn from registration.'
    default:
      return 'There was a problem checking your gain site reference - please try again later.'
  }
}

const checkBGS = async bgsNumber => {
  console.log('In checkBGS')
  let errorMsg = ''

  const gainsiteUrl = new URL(`${BACKEND_API.BASE_URL}gainsite/${bgsNumber}?code=${BACKEND_API.CODE_QUERY_PARAMETER}`)

  try {
    const { payload } = await wreck.get(gainsiteUrl.href, {
      json: true,
      headers: {
        'Ocp-Apim-Subscription-Key': BACKEND_API.SUBSCRIPTION_KEY
      }
    })
    console.log(payload)
    if (payload.gainsiteStatus !== 'Registered') {
      errorMsg = getErrorMessage(payload.gainsiteStatus)
    }
  } catch (err) {
    console.log(err)
    console.log(err.output.payload)
    errorMsg = 'The gain site reference was not recognised'
  }

  console.log(errorMsg)
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
    await checkBGS(bngNumber)
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
