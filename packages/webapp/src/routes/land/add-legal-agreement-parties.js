import constants from '../../utils/constants.js'
import {
  checkApplicantDetails,
  processRegistrationTask,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'

const validateOrganisation = organisation => {
  const legalAgreementPartiesError = []

  if (organisation.organisationName.trim().length === 0) {
    legalAgreementPartiesError.push({
      text: 'Enter the name of the legal party',
      href: '#organisationName'
    })
  }

  if (organisation.organisationRole === undefined) {
    legalAgreementPartiesError.push({
      text: 'Select the role',
      href: '#organisationRole'
    })
  }

  if (legalAgreementPartiesError.length > 0) {
    const errorConstruct = {
      text: '',
      href: ''
    }

    legalAgreementPartiesError.unshift(errorConstruct)
  }

  return legalAgreementPartiesError
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_LEGAL_AGREEMENT_PARTIES
    })

    const { orgId } = request.query

    const legalAgreementParties = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    if (orgId) {
      const organisation = legalAgreementParties[orgId]
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
        organisation,
        legalAgreementType
      })
    }

    return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const organisation = request.payload
    const { orgId } = request.query

    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    const legalAgreementPartiesError = validateOrganisation(organisation)

    if (legalAgreementPartiesError.length > 0) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
        organisation,
        legalAgreementType,
        err: legalAgreementPartiesError
      })
    }

    const legalAgreementParties = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)

    if (orgId) {
      legalAgreementParties.splice(orgId, 1, organisation)
    } else {
      legalAgreementParties.push(organisation)
    }

    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, legalAgreementParties)
    return h.redirect(constants.routes.LEGAL_PARTY_LIST)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.ADD_LEGAL_AGREEMENT_PARTIES,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.ADD_LEGAL_AGREEMENT_PARTIES,
  handler: handlers.post
}]
