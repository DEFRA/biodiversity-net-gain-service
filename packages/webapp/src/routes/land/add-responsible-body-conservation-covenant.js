import isEmpty from 'lodash/isEmpty.js'
import constants from '../../utils/constants.js'
import { validateTextInput, checkForDuplicate, getLegalAgreementDocumentType, validateIdGetSchemaOptional } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator-v5.js'

const ID = '#responsibleBody'
const handlers = {
  get: async (request, h) => {
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
        err: errors.err
      })
    } else {
      if (id) {
        legalAgreementResponsibleBodies.splice(id, 1, responsibleBody)
      } else { legalAgreementResponsibleBodies.push(responsibleBody) }
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, legalAgreementResponsibleBodies)
      return getNextStep(request, h)
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
