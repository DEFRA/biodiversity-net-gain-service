import constants from '../../utils/constants.js'
import {
  getLegalAgreementDocumentType,
  validateFirstLastNameOfLandownerOrLeaseholder,
  validateLengthOfCharsLessThan50
} from '../../utils/helpers.js'
import isEmpty from 'lodash/isEmpty.js'

const handlers = {
  get: async (request, h) => {
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

    const firstNameError = validateFirstLastNameOfLandownerOrLeaseholder(firstName, 'first name', 'firstNameId')
    const lastNameError = validateFirstLastNameOfLandownerOrLeaseholder(lastName, 'last name', 'lastNameId')
    const middleNameError = validateLengthOfCharsLessThan50(middleName, 'middle name', 'middleNameId')

    if (!isEmpty(firstNameError) || !isEmpty(lastNameError) || !isEmpty(middleNameError)) {
      return h.view(constants.views.ADD_LANDOWNER_INDIVIDUAL, {
        err: Object.values({ ...firstNameError, ...lastNameError, ...middleNameError }),
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
