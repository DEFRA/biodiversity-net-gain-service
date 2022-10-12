import constants from '../../utils/constants.js'

const START_ID = '#organisation'

function processEmptyPartySelection (partySelectionData, index, combinedError) {
  partySelectionData.organisationError.push({
    text: 'Enter the name of the legal party',
    href: `[${START_ID}[${index}][organisationName]`,
    index
  })
  combinedError.push({
    text: 'Enter the name of the legal party',
    href: `[${START_ID}[${index}][organisationName]`
  })
  partySelectionData.hasError = true
}

function processSelectedParty (index, request, organisation, partySelectionData) {
  const organisationValue = {
    index,
    value: request.payload[organisation]
  }
  partySelectionData.organisations.push(organisationValue)
}

function processParty (request, organisation, partySelectionData, index, combinedError) {
  if (request.payload[organisation] === '') {
    processEmptyPartySelection(partySelectionData, index, combinedError)
  } else {
    processSelectedParty(index, request, organisation, partySelectionData)
  }
}

function processUndefinedRole (partySelectionData, index, combinedError) {
  partySelectionData.roleError.push({
    text: 'Select the role',
    href: `[${START_ID}[${index}][role]`,
    index
  })
  combinedError.push({
    text: 'Select the role',
    href: `[${START_ID}[${index}][role]`
  })
  partySelectionData.hasError = true
}

function processDefinedRole (request, organisationRole, index, partySelectionData, combinedError) {
  const roleDetails = getRoleDetails(request.payload[organisationRole], index)
  if (roleDetails.other) {
    let otherParty = request.payload.otherPartyName.constructor === Array ? request.payload.otherPartyName[index] : request.payload.otherPartyName
    if (otherParty === undefined || otherParty === '') {
      otherParty = ''
      partySelectionData.roleError.push({
        text: 'Other type of role cannot be left blank',
        href: `[${START_ID}[${index}][role]`,
        index
      })
      combinedError.push({
        text: 'Other type of role cannot be left blank',
        href: `[${START_ID}[${index}][role]`
      })
    }
    roleDetails.otherPartyName = otherParty
  }
  partySelectionData.roles.push(roleDetails)
}

function checkEmptySelection (organisations, request) {
  const partySelectionData = {
    organisationError: [],
    roleError: [],
    organisations: [],
    roles: []
  }
  const combinedError = []

  organisations.forEach((organisation, index) => {
    const organisationRole = organisation.replaceAll('organisationName', 'role')
    processParty(request, organisation, partySelectionData, index, combinedError)
    if (request.payload[organisationRole] === undefined) {
      processUndefinedRole(partySelectionData, index, combinedError)
    } else {
      processDefinedRole(request, organisationRole, index, partySelectionData, combinedError)
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
    const partySelectionData = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
    if (partySelectionData !== undefined) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, partySelectionData)
    }
    return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
      otherPartyName: ''
    })
  },
  post: async (request, h) => {
    const organisations = Object.keys(request.payload).filter(name => name.includes('organisationName'))
    const selectionCount = organisations.length

    const partySelectionData = checkEmptySelection(organisations, request)

    partySelectionData.selectionCount = selectionCount
    if (partySelectionData.err !== undefined) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, partySelectionData)
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, partySelectionData)
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
