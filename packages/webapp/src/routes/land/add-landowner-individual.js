import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  getLegalAgreementDocumentType,
  validateFirstLastName,
  validateLengthOfCharsLessThan50
} from '../../utils/helpers.js'
import isEmpty from 'lodash/isEmpty.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_LANDOWNER_INDIVIDUAL
    })

    const { id } = request.query

    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    const lpaList = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST)

    let individual

    if (id) {
      individual = lpaList[id].value
    }

    return h.view(constants.views.ADD_LANDOWNER_INDIVIDUAL, {
      individual,
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const { firstName, middleName, lastName } = request.payload

    const firstNameError = validateFirstLastName(firstName, 'first name', 'firstNameId')
    const lastNameError = validateFirstLastName(lastName, 'last name', 'lastNameId')
    const middleNameError = validateLengthOfCharsLessThan50(middleName, 'middle name', 'middleNameId')

    if (!isEmpty(firstNameError) || !isEmpty(lastNameError)) {
      return h.view(constants.views.ADD_LANDOWNER_INDIVIDUAL, {
        err: Object.values({ ...firstNameError, ...lastNameError }),
        firstNameError: firstNameError?.err[0],
        lastNameError: lastNameError?.err[0],
        middleNameError: middleNameError?.err[0]
      })
    }

    const lpaList = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST) ?? []

    lpaList.push({ type: 'individual', value: { firstName, middleName, lastName } })
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST, lpaList)

    return h.redirect(constants.routes.LEGAL_AGREEMENT_LPA_LIST)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.ADD_LANDOWNER_INDIVIDUAL,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_LANDOWNER_INDIVIDUAL,
  handler: handlers.post
}]
