import constants from '../../utils/constants.js'
import { checked, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const href = '#anyOtherLO-yes'
const handlers = {
  get: async (request, h) => h.view(constants.views.ANY_OTHER_LANDOWNERS, {
    ...getContext(request),
    checked
  }),
  post: async (request, h) => {
    const anyOtherLOValue = request.payload.anyOtherLOValue
    request.yar.set(constants.redisKeys.ANY_OTHER_LANDOWNERS_CHECKED, anyOtherLOValue)
    if (anyOtherLOValue === 'Yes') {
      return h.redirect(constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION)
    } else if (anyOtherLOValue === 'No') {
      return h.redirect(constants.routes.HABITAT_PLAN_LEGAL_AGREEMENT)
    } else {
      return h.view(constants.views.ANY_OTHER_LANDOWNERS, {
        ...getContext(request),
        checked,
        err: [
          {
            text: 'Select yes if there are any other landowners or leaseholders',
            href
          }
        ]
      })
    }
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
