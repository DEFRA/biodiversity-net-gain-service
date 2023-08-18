import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'

const validateOrganisation = organisation => {
  let errorFlag = false
  const errorConstruct = {
    text: undefined,
    href: undefined
  }

  const legalAgreementPartiesError = Array(2).fill(errorConstruct)

  if (organisation.organisationName.trim().length === 0) {
    legalAgreementPartiesError[0] = {
      text: 'Enter the name of the legal party',
      href: '#organisationName'
    }
    errorFlag = true
  }

  if (organisation.organisationRole === undefined) {
    legalAgreementPartiesError[1] = {
      text: 'Select the role',
      href: '#organisationRole'
    }
    errorFlag = true
  }

  return { legalAgreementPartiesError, errorFlag }
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

    const { legalAgreementPartiesError, errorFlag } = validateOrganisation(organisation)

    if (errorFlag) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
        organisation,
        legalAgreementType,
        err: legalAgreementPartiesError,
        organisationNameErr: legalAgreementPartiesError[0].text ? legalAgreementPartiesError[0] : undefined,
        organisationRoleErr: legalAgreementPartiesError[1].text ? legalAgreementPartiesError[1] : undefined
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
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ADD_LEGAL_AGREEMENT_PARTIES,
  handler: handlers.post
}]
