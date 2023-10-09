import constants from '../../utils/constants.js'
import { processRegistrationTask, validateTextInput, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const ID = '#responsibleBody'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT
    })
    const { id } = request.query
    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    let responsibleBody = {
      responsibleBodyName: ''
    }
    if (id) { responsibleBody = legalAgreementResponsibleBodies[id] }
    return h.view(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT, {
      legalAgreementType,
      responsibleBody
    })
  },
  post: async (request, h) => {
    const responsibleBody = request.payload
    const { id } = request.query
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    const error = validateTextInput(responsibleBody.responsibleBodyName, ID, 'name', null, 'responsible body')
    if (error) {
      return h.view(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT, {
        responsibleBody,
        legalAgreementType,
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
