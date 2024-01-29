import isEmpty from 'lodash/isEmpty.js'
import constants from '../../utils/constants.js'
import { processRegistrationTask, validateTextInput, checkForDuplicate, getLegalAgreementDocumentType, validateIdGetSchemaOptional } from '../../utils/helpers.js'

const ID = '#responsibleBody'
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT
    })
    const { id } = request.query
    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    let responsibleBody = {
      responsibleBodyName: ''
    }
    if (id) { responsibleBody = legalAgreementResponsibleBodies[id] }
    return h.view(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT, {
      legalAgreementType,
      responsibleBody
    })
  },
  post: async (request, h) => {
    const responsibleBody = request.payload
    const { id } = request.query
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    let errors = {}
    const legalAgreementResponsibleBodies = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES) ?? []
    const excludeIndex = id !== undefined ? parseInt(id, 10) : null
    errors = validateTextInput(responsibleBody.responsibleBodyName, ID, 'name', 50, 'responsible body')
    if (isEmpty(errors)) {
      const duplicateError = checkForDuplicate(
        legalAgreementResponsibleBodies,
        'responsibleBodyName',
        responsibleBody.responsibleBodyName,
        '#responsibleBody',
        'This responsible body has already been added - enter a different responsible body, if there is one',
        excludeIndex
      )
      if (duplicateError) {
        errors = duplicateError
      }
    }
    if (!isEmpty(errors)) {
      return h.view(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT, {
        responsibleBody,
        legalAgreementType,
        err: Object.values(errors.err)
      })
    } else {
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
  path: constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}, {
  method: 'POST',
  path: constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT,
  handler: handlers.post,
  options: validateIdGetSchemaOptional
}]
