import constants from '../../utils/constants.js'
import { BACKEND_API } from '../../utils/config.js'
import wreck from '@hapi/wreck'

const getGainSiteApiUrl = bgsNumber => {
  const url = new URL(`${BACKEND_API.BASE_URL}gainsite/${bgsNumber}`)
  if (BACKEND_API.CODE_QUERY_PARAMETER) {
    url.searchParams.set('code', BACKEND_API.CODE_QUERY_PARAMETER)
  }
  return url
}

const getStatusErrorMessage = status => {
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

const checkBGSNumber = async (bgsNumber, hrefId) => {
  let errorText

  if (!bgsNumber.trim()) {
    errorText = 'Enter your biodiversity gain site number'
  } else {
    const gainsiteUrl = getGainSiteApiUrl(bgsNumber)

    try {
      const { payload } = await wreck.get(gainsiteUrl.href, {
        json: true,
        headers: {
          'Ocp-Apim-Subscription-Key': BACKEND_API.SUBSCRIPTION_KEY
        }
      })

      if (payload.gainsiteStatus !== 'Registered') {
        errorText = getStatusErrorMessage(payload.gainsiteStatus)
      }
    } catch (err) {
      errorText = 'The gain site reference was not recognised - enter a reference for an approved gain site.'
    }
  }

  if (errorText) {
    return [{
      text: errorText,
      href: hrefId
    }]
  }

  return null
}

const handlers = {
  get: async (request, h) => {
    const bgsNumber = request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
    return h.view(constants.views.DEVELOPER_BNG_NUMBER, {
      bgsNumber
    })
  },
  post: async (request, h) => {
    const bgsNumber = request.payload.bgsNumber?.trim()
    const error = await checkBGSNumber(bgsNumber, '#bgsNumber')
    if (error) {
      request.yar.clear(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
      return h.view(constants.views.DEVELOPER_BNG_NUMBER, {
        bgsNumber,
        err: error
      })
    } else {
      const currentBGSNumber = request.yar.get(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
      if (currentBGSNumber === bgsNumber) {
        return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || request.yar.get(constants.redisKeys.DEVELOPER_REFERER, true) || constants.routes.DEVELOPER_UPLOAD_METRIC)
      }
      request.yar.set(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER, bgsNumber)
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
