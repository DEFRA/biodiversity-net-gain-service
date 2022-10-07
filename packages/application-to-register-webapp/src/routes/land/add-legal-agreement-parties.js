import constants from '../../utils/constants.js'

function checkEmptySelection (organisations, request, organisationRoles) {
  const partySelectioError = {
    organisationError: [],
    roleError: [],
    organisations: [],
    roles: []
  }
  const combinedError = []

  organisations.forEach((organisation, index) => {
    const organisationRole = organisation.replaceAll('organisationName', 'role')
    if (request.payload[organisation] === '') {
      partySelectioError.organisationError.push({
        text: 'Enter the name of the legal party',
        href: '#organisation[' + index + '][organisationName]',
        index: index
      })
      combinedError.push({
        text: 'Enter the name of the legal party',
        href: '#organisation[' + index + '][organisationName]'
      })
      partySelectioError.hasError = true
    } else {
      const organisationValue = {
        index,
        value: request.payload[organisation]
      }
      partySelectioError.organisations.push(organisationValue)
    }
    if (request.payload[organisationRole] === undefined) {
      partySelectioError.roleError.push({
        text: 'Select the role',
        href: '#organisation[' + index + '][role]',
        index: index
      })
      combinedError.push({
        text: 'Select the role',
        href: '#organisation[' + index + '][role]'
      })
      partySelectioError.hasError = true
    } else {
      const roleDetails = getRoleDetails(request.payload[organisationRole], index)
      partySelectioError.roles.push(roleDetails)
    }
  })
  if (combinedError.length > 0) {
    partySelectioError.err = combinedError
  }
  return partySelectioError
}
function getRoleDetails (roleValue, indexValue) {
  let roleDetails
  switch (roleValue) {
    case 'County Council':
      roleDetails = {
        organisationIndex: indexValue,
        rowIndex: 0,
        county_council: true
      }
      break
    case 'Developer':
      roleDetails = {
        organisationIndex: indexValue,
        rowIndex: 1,
        developer: true
      }
      break
    case 'Landowner':
      roleDetails = {
        organisationIndex: indexValue,
        rowIndex: 2,
        landowner: true
      }
      break
    case 'Responsible body':
      roleDetails = {
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
  }
  return roleDetails
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
      otherPartyName: ''
    })
  },
  post: async (request, h) => {
    const organisations = Object.keys(request.payload).filter(name => name.includes('organisationName'))
    const organisationRoles = Object.keys(request.payload).filter(name => name.includes('role'))
    const selectionCount = organisations.length

    const partySelectioError = checkEmptySelection(organisations, request, organisationRoles)

    partySelectioError.selectionCount = selectionCount
    if (partySelectioError.err !== undefined) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, partySelectioError)
    }
    return h.redirect('/' + constants.views.LEGAL_AGREEMENT_START_DATE)
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
