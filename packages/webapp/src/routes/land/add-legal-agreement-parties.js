import constants from '../../utils/constants.js'
import {
  checkApplicantDetails,
  processRegistrationTask,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'
import isEmpty from 'lodash/isEmpty.js'

const validateOrganisation = organisation => {
  const errors = {}

  if (organisation.organisationName.trim().length === 0) {
    errors.organisationNameErr = {
      text: 'Enter the name of the legal party',
      href: '#organisationName'
    }
  }

  if (organisation.organisationRole === undefined) {
    errors.organisationRoleErr = {
      text: 'Select the role',
      href: '#localAuthorityRole'
    }
  } else if (organisation.organisationRole === 'Other' && organisation.organisationOtherRole.trim().length === 0) {
    errors.organisationOtherRoleErr = {
      text: 'Enter the role of the legal party',
      href: '#organisationOtherRole'
    }
  }

  return errors
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
    let organisation = {}
    if (orgId) {
      organisation = legalAgreementParties[orgId]
    } else {
      organisation.organisationOtherRole = ''
    }
    return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
      organisation,
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const organisation = request.payload
    const { orgId } = request.query

    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    const legalAgreementPartiesError = validateOrganisation(organisation)

    if (!isEmpty(legalAgreementPartiesError)) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
        organisation,
        legalAgreementType,
        err: Object.values(legalAgreementPartiesError),
        organisationNameErr: legalAgreementPartiesError?.organisationNameErr,
        organisationRoleErr: legalAgreementPartiesError?.organisationRoleErr,
        organisationOtherRoleErr: legalAgreementPartiesError?.organisationOtherRoleErr
      })
    }

    const legalAgreementParties = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES) ?? []

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
