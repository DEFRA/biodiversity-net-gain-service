import constants from '../../utils/constants.js'
import { getReferrer, setReferrer } from '../../utils/helpers.js'

function processEmptyPartySelection (partySelectionData, index, combinedError, startId) {
  const errorConstruct = {
    text: '',
    href: ''
  }
  const partyErrorSelection = Object.assign({}, errorConstruct)
  partyErrorSelection.text = 'Enter the name of the legal party'
  partyErrorSelection.href = `[${startId}[${index}][organisationName]`
  partyErrorSelection.index = index
  partySelectionData.organisationError.push(partyErrorSelection)

  const partyCombinedError = Object.assign({}, errorConstruct)
  partyCombinedError.text = 'Enter the name of the legal party'
  partyCombinedError.href = `[${startId}[${index}][organisationName]`
  combinedError.push(partyCombinedError)

  partySelectionData.hasError = true
}

function processSelectedParty (index, request, organisation, partySelectionData) {
  const organisationValue = {
    index,
    value: request.payload[organisation]
  }
  partySelectionData.organisations.push(organisationValue)
}

function processParty (request, organisation, partySelectionData, index, combinedError, startId) {
  if (request.payload[organisation] === '') {
    processEmptyPartySelection(partySelectionData, index, combinedError, startId)
  } else {
    processSelectedParty(index, request, organisation, partySelectionData)
  }
}

function processUndefinedRole (partySelectionData, index, combinedError, startId) {
  const errorConstruct = {
    text: '',
    href: ''
  }
  const roleSelectionError = Object.assign({}, errorConstruct)
  roleSelectionError.text = 'Select the role'
  roleSelectionError.href = `[${startId}[${index}][role]`
  roleSelectionError.index = index
  partySelectionData.roleError.push(roleSelectionError)

  const roleCombinedError = Object.assign({}, errorConstruct)
  roleCombinedError.text = 'Select the role'
  roleCombinedError.href = `[${startId}[${index}][role]`
  combinedError.push(roleCombinedError)
  partySelectionData.hasError = true
}

function processDefinedRole (request, organisationRole, index, partySelectionData, combinedError, startId) {
  const partyRoleError = {
    text: '',
    href: ''
  }
  const roleDetails = getRoleDetails(request.payload[organisationRole], index)
  if (roleDetails.other) {
    let otherParty = request.payload.otherPartyName.constructor === Array ? request.payload.otherPartyName[index] : request.payload.otherPartyName
    if (otherParty === undefined || otherParty === '') {
      otherParty = ''
      const currentError = Object.assign({}, partyRoleError)
      currentError.text = 'Other type of role cannot be left blank'
      currentError.href = `[${startId}[${index}][role]`
      currentError.index = index
      partySelectionData.roleError.push(currentError)

      const currentCombinedError = Object.assign({}, partyRoleError)
      currentCombinedError.text = 'Other type of role cannot be left blank'
      currentCombinedError.href = `[${startId}[${index}][role]`
      combinedError.push(currentCombinedError)
    }
    roleDetails.otherPartyName = otherParty
  }
  partySelectionData.roles.push(roleDetails)
}

function checkEmptySelection (organisations, request, startId) {
  const partySelectionData = {
    organisationError: [],
    roleError: [],
    organisations: [],
    roles: []
  }
  const combinedError = []

  organisations.forEach((organisation, index) => {
    const organisationRole = organisation.replaceAll('organisationName', 'role')
    processParty(request, organisation, partySelectionData, index, combinedError, startId)
    if (request.payload[organisationRole] === undefined) {
      processUndefinedRole(partySelectionData, index, combinedError, startId)
    } else {
      processDefinedRole(request, organisationRole, index, partySelectionData, combinedError, startId)
    }
  })
  if (combinedError.length > 0) {
    partySelectionData.err = combinedError
  }
  return partySelectionData
}

function getRoleDetails (roleValue, indexValue) {
  let roleDetails
  switch (roleValue) {
    case 'County Council':
      roleDetails = {
        value: 'County Council',
        organisationIndex: indexValue,
        rowIndex: 0,
        county_council: true
      }
      break
    case 'Developer':
      roleDetails = {
        value: 'Developer',
        organisationIndex: indexValue,
        rowIndex: 1,
        developer: true
      }
      break
    case 'Landowner':
      roleDetails = {
        value: 'Landowner',
        organisationIndex: indexValue,
        rowIndex: 2,
        landowner: true
      }
      break
    case 'Responsible body':
      roleDetails = {
        value: 'Responsible body',
        organisationIndex: indexValue,
        rowIndex: 3,
        responsible_body: true
      }
      break
    case 'Other':
      roleDetails = {
        organisationIndex: indexValue,
        rowIndex: 4,
        other: true
      }
      break
    default:
      roleDetails = undefined
  }
  return roleDetails
}

const handlers = {
  get: async (request, h) => {
    setReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY)
    const referredFrom = getReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY)
    if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
      const partySelectionData = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
      if (partySelectionData !== undefined) {
        return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, partySelectionData)
      }
    } else {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
        otherPartyName: ''
      })
    }
  },
  post: async (request, h) => {
    const startId = '#organisation'
    const organisations = Object.keys(request.payload).filter(name => name.includes('organisationName'))
    const selectionCount = organisations.length

    const partySelectionData = checkEmptySelection(organisations, request, startId)

    partySelectionData.selectionCount = selectionCount
    if (partySelectionData.err !== undefined) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, partySelectionData)
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, partySelectionData)
      const referredFrom = getReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY)
      if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
        return h.redirect(referredFrom)
      }
      return h.redirect('/' + constants.views.LEGAL_AGREEMENT_START_DATE)
    }
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
