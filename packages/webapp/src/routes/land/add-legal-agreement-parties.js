import constants from '../../utils/constants.js'
import {
  checkApplicantDetails,
  processRegistrationTask,
  getLegalAgreementDocumentType
} from '../../utils/helpers.js'

function processEmptyPartySelection (partySelectionData, combinedError, startId) {
  const errorConstruct = {
    text: '',
    href: ''
  }
  const partyErrorSelection = Object.assign({}, errorConstruct)
  partyErrorSelection.text = 'Enter the name of the legal party'
  partyErrorSelection.href = `[${startId}[organisationName]`
  partyErrorSelection.index = index
  partySelectionData.organisationError.push(partyErrorSelection)

  const partyCombinedError = Object.assign({}, errorConstruct)
  partyCombinedError.text = 'Enter the name of the legal party'
  partyCombinedError.href = `[${startId}[organisationName]`
  combinedError.push(partyCombinedError)

  partySelectionData.hasError = true
}

function processSelectedParty (organisation, partySelectionData) {
  partySelectionData.organisations.push(organisation)
}

function processParty (organisation, partySelectionData, combinedError, startId) {
  if (organisation === '') {
    processEmptyPartySelection(partySelectionData, combinedError, startId)
  } else {
    processSelectedParty(organisation, partySelectionData)
  }
}

function processUndefinedRole (partySelectionData, combinedError, startId) {
  const errorConstruct = {
    text: '',
    href: ''
  }
  const roleSelectionError = Object.assign({}, errorConstruct)
  roleSelectionError.text = 'Select the role'
  roleSelectionError.href = `[${startId}[role]`
  partySelectionData.roleError.push(roleSelectionError)

  const roleCombinedError = Object.assign({}, errorConstruct)
  roleCombinedError.text = 'Select the role'
  roleCombinedError.href = `[${startId}[role]`
  combinedError.push(roleCombinedError)
  partySelectionData.hasError = true
}

function processDefinedRole (request, organisationRole, partySelectionData, combinedError, startId) {
  const partyRoleError = {
    text: '',
    href: ''
  }
  const roleDetails = getRoleDetails(request.payload[organisationRole])
  if (roleDetails.other) {
    let otherParty = request.payload.otherPartyName
    if (otherParty === undefined || otherParty === '') {
      otherParty = ''
      const currentError = Object.assign({}, partyRoleError)
      currentError.text = 'Other type of role cannot be left blank'
      currentError.href = `[${startId}[role]`
      currentError.index = index
      partySelectionData.roleError.push(currentError)

      const currentCombinedError = Object.assign({}, partyRoleError)
      currentCombinedError.text = 'Other type of role cannot be left blank'
      currentCombinedError.href = `[${startId}[role]`
      combinedError.push(currentCombinedError)
    }
    roleDetails.otherPartyName = otherParty
  }
  partySelectionData.roles.push(roleDetails)
}

function checkEmptySelection (organisation, request) {
  const partySelectionData = {
    organisationError: [],
    roleError: [],
    organisations: [],
    roles: []
  }
  const combinedError = []
  const startId = '#organisation'

  processParty(organisation, partySelectionData, combinedError, startId)
  
  const organisationRole = organisation['organisation[role]']
  if (organisationRole === undefined) {
    processUndefinedRole(partySelectionData, combinedError)
  } else {
    processDefinedRole(request, organisationRole, partySelectionData, combinedError, startId)
  }
  if (combinedError.length > 0) {
    partySelectionData.err = combinedError
  }
  return partySelectionData
}

function getRoleDetails (roleValue) {
  let roleDetails
  switch (roleValue) {
    case 'County Council':
      roleDetails = {
        value: 'County Council',
        rowIndex: 0,
        county_council: true
      }
      break
    case 'Developer':
      roleDetails = {
        value: 'Developer',
        rowIndex: 1,
        developer: true
      }
      break
    case 'Landowner':
      roleDetails = {
        value: 'Landowner',
        rowIndex: 2,
        landowner: true
      }
      break
    case 'Responsible body':
      roleDetails = {
        value: 'Responsible body',
        rowIndex: 3,
        responsible_body: true
      }
      break
    default :
      roleDetails = {
        rowIndex: 4,
        other: true
      }
  }
  return roleDetails
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.ADD_LEGAL_AGREEMENT_PARTIES
    })
    const partySelectionData = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    if (partySelectionData) {
      partySelectionData.roles?.forEach(role => {
        if (role.otherPartyName === undefined) {
          role.otherPartyName = ''
        }
      })
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
        partySelectionData,
        legalAgreementType
      })
    }
    return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
      roles: [{
        organisationIndex: 0,
        otherPartyName: ''
      }],
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const organisation = request.payload
    const partySelectionData = checkEmptySelection(organisation, request)
    if (partySelectionData.err) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, partySelectionData)
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, partySelectionData)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.LEGAL_PARTY_LIST)
    }
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
