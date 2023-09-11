import constants from '../../utils/constants.js'
import { processRegistrationTask, getLegalAgreementDocumentType, validateResponsibleBody } from '../../utils/helpers.js'

const ID = '#responsibleBody'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add responsible body'
    }, {
      inProgressUrl: constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT
    })
    const { id } = request.query
    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    let responsibleBody = ''
    if (id) { responsibleBody = legalAgreementResponsibleBodies[id] }
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT, {
      responsibleBody,
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const responsibleBody = request.payload.responsibleBody
    const { id } = request.query
    const error = validateResponsibleBody(responsibleBody, ID)
    if (error) {
      return h.view(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT, {
        responsibleBody,
        ...error
      })
    } else {
      const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES) ?? []
      if (id) {
        legalAgreementResponsibleBodies.splice(id, 1, responsibleBody)
      } else { legalAgreementResponsibleBodies.push(responsibleBody) }
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, legalAgreementResponsibleBodies)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_RESPONSIBLE_BODIES)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT,
  handler: handlers.post
}]
