import constants from '../../utils/constants.js'
import { buildFullName } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const { id } = request.query

    const lpaList = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST) || []
    const item = lpaList[id]
    let lpaToRemove
    if (item?.type === 'individual') {
      lpaToRemove = buildFullName(item)
    } else if (item?.type === 'organisation') {
      lpaToRemove = item?.value
    }
    return h.view(constants.views.LEGAL_AGREEMENT_LPA_REMOVE, {
      lpaToRemove
    })
  },
  post: async (request, h) => {
    const { id } = request.query
    const { lpaRemove } = request.payload
    const lpaList = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST)

    if (!lpaRemove) {
      const lpaToRemove = lpaList[id]

      return h.view(constants.views.LEGAL_AGREEMENT_LPA_REMOVE, {
        lpaToRemove,
        err: [{
          text: 'Select yes if you want to remove legal agreement lpa',
          href: '#lpaRemove'
        }]
      })
    }

    if (lpaRemove === 'yes') {
      lpaList.splice(id, 1)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, lpaList)
    }
    return h.redirect(constants.routes.LEGAL_AGREEMENT_LPA_LIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_LPA_REMOVE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_LPA_REMOVE,
  handler: handlers.post
}]
