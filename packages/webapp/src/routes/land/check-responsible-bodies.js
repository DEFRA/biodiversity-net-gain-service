import constants from '../../utils/constants.js'
import { processRegistrationTask, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const getCustomizedHTML = (item, index) => {
  return {
    key: {
      text: item,
      classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
    },
    actions: {
      items: [{
        href: `${constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT}?id=${index}`,
        text: 'Change'
      }, {
        href: `${constants.routes.REMOVE_RESPONSIBLE_BODY}?id=${index}`,
        text: 'Remove'
      }],
      classes: 'govuk-summary-list__key govuk-!-font-weight-regular hmrc-summary-list__key'
    },
    class: 'govuk-summary-list__row'
  }
}
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Check responsible body'
    }, {
      inProgressUrl: constants.routes.CHECK_RESPONSIBLE_BODIES
    })

    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    console.log(legalAgreementResponsibleBodies)
    const legalAgreementResponsibleBodiesWithAction = legalAgreementResponsibleBodies.map((currElement, index) => getCustomizedHTML(currElement, index))
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const { ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT, REMOVE_RESPONSIBLE_BODY } = constants.routes

    return h.view(constants.views.CHECK_RESPONSIBLE_BODIES, {
      legalAgreementResponsibleBodiesWithAction,
      legalAgreementResponsibleBodies,
      legalAgreementType,
      routes: { ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT, REMOVE_RESPONSIBLE_BODY }
    })
  },
  post: async (request, h) => {
    const { addAnotherResponsibleBody } = request.payload

    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    if (!addAnotherResponsibleBody) {
      return h.view(constants.views.CHECK_RESPONSIBLE_BODIES, {
        legalAgreementResponsibleBodies,
        legalAgreementType,
        routes: constants.routes,
        err: [{
          text: 'Select yes if you have added all responsible bodies',
          href: '#addAnotherResponsibleBody'
        }]
      })
    }

    if (addAnotherResponsibleBody === 'yes') {
      return h.redirect(constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT)
    }

    return h.redirect(constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT)
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
