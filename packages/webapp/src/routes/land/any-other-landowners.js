import constants from '../../utils/constants.js'
import { checked, getLegalAgreementDocumentType } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator-v5.js'

const handlers = {
  get: async (request, h) => h.view(constants.views.ANY_OTHER_LANDOWNERS, {
    ...getContext(request),
    checked
  }),
  post: async (request, h) => {
    const anyOtherLOValue = request.payload.anyOtherLOValue
    request.yar.set(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED, anyOtherLOValue)

    return getNextStep(request, h, (e) => {
      return h.view(constants.views.ANY_OTHER_LANDOWNERS, {
        ...getContext(request),
        checked,
        err: [e]
      })
    })
  }
}

const getContext = request => ({
  legalAgreementType: getLegalAgreementDocumentType(
    request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase(),
  selectedAnyOtherLOValue: request.yar.get(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED)
})

export default [{
  method: 'GET',
  path: constants.routes.ANY_OTHER_LANDOWNERS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ANY_OTHER_LANDOWNERS,
  handler: handlers.post
}]
