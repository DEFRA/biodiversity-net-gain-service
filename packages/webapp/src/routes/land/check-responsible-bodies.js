import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const getCustomizedHTML = (item, index, isCombinedCase) => {
  return {
    key: {
      text: item.responsibleBodyName,
      classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
    },
    actions: {
      items: [{
        href: `${isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT : constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT}?id=${index}`,
        text: 'Change'
      }, {
        href: `${isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_REMOVE_RESPONSIBLE_BODY : constants.routes.REMOVE_RESPONSIBLE_BODY}?id=${index}`,
        text: 'Remove'
      }],
      classes: 'govuk-summary-list__key govuk-!-font-weight-regular hmrc-summary-list__key'
    },
    class: 'govuk-summary-list__row'
  }
}
const handlers = {
  get: async (request, h) => {
    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    if (legalAgreementResponsibleBodies.length === 0) {
      return h.redirect(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
    }
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    const legalAgreementResponsibleBodiesWithAction = legalAgreementResponsibleBodies.map((currElement, index) => getCustomizedHTML(currElement, index, isCombinedCase))
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const { ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT, REMOVE_RESPONSIBLE_BODY } = constants.routes
    return h.view(constants.views.CHECK_RESPONSIBLE_BODIES, {
      legalAgreementResponsibleBodiesWithAction,
      legalAgreementResponsibleBodies,
      legalAgreementType,
      routes: { ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT, REMOVE_RESPONSIBLE_BODY }
    })
  },
  post: async (request, h) => {
    const { addAnotherResponsibleBody } = request.payload
    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    const legalAgreementResponsibleBodiesWithAction = legalAgreementResponsibleBodies.map((currElement, index) => getCustomizedHTML(currElement, index))
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    if (!addAnotherResponsibleBody) {
      return h.view(constants.views.CHECK_RESPONSIBLE_BODIES, {
        legalAgreementResponsibleBodies,
        legalAgreementResponsibleBodiesWithAction,
        legalAgreementType,
        routes: constants.routes,
        err: [{
          text: 'Select yes if you have added all responsible bodies',
          href: '#addAnotherResponsibleBody'
        }]
      })
    }
    return getNextStep(request, h)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_RESPONSIBLE_BODIES,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_RESPONSIBLE_BODIES,
  handler: handlers.post
}]
