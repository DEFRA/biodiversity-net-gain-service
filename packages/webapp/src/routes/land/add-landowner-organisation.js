import constants from '../../utils/constants.js'
import {
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const { id } = request.query

    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const lpaList = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST)

    let organisationName

    if (id) {
      organisationName = lpaList[id].value
    }

    return h.view(constants.views.ADD_LANDOWNER_ORGANISATION, {
      organisationName,
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const { organisationName } = request.payload

    if (!organisationName) {
      const organisationNameErr = [{
        text: 'Organisation name must be 2 characters or more',
        href: 'organisationName'
      }]

      return h.view(constants.views.ADD_LANDOWNER_ORGANISATION, {
        err: Object.values(organisationNameErr),
        organisationNameErr
      })
    }

    const lpaList = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST) ?? []
    lpaList.push({ type: 'organisation', value: organisationName })

    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST, lpaList)
    return h.redirect(constants.routes.LEGAL_AGREEMENT_LPA_LIST)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.ADD_LANDOWNER_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNER_ORGANISATION,
  handler: handlers.post
}]
