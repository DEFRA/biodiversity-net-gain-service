import constants from '../../utils/constants.js'

function checkEmptySelection (organisations, request, organisationRoles) {
  const partySelectioData = {
    organisationError: [],
    roleError: [],
    organisations: [],
    roles: []
  }
  const combinedError = []

  organisations.forEach((organisation, index) => {
    const organisationRole = organisation.replaceAll('organisationName', 'role')
    if (request.payload[organisation] === '') {
      partySelectioData.organisationError.push({
        text: 'Enter the name of the legal party',
        href: '#organisation[' + index + '][organisationName]',
        index
      })
      combinedError.push({
        text: 'Enter the name of the legal party',
        href: '#organisation[' + index + '][organisationName]'
      })
      partySelectioData.hasError = true
    } else {
      const organisationValue = {
        index,
        value: request.payload[organisation]
      }
      partySelectioData.organisations.push(organisationValue)
    }
    if (request.payload[organisationRole] === undefined) {
      partySelectioData.roleError.push({
        text: 'Select the role',
        href: '#organisation[' + index + '][role]',
        index
      })
      combinedError.push({
        text: 'Select the role',
        href: '#organisation[' + index + '][role]'
      })
      partySelectioData.hasError = true
    } else {
      const roleDetails = getRoleDetails(request.payload[organisationRole], index)
      if (roleDetails.other) {
        let otherParty = request.payload.otherPartyName[index]
        if (otherParty === undefined || otherParty === '') {
          otherParty = ''
          partySelectioData.roleError.push({
            text: 'Other type of role cannot be left blank',
            href: '#organisation[' + index + '][role]',
            index
          })
          combinedError.push({
            text: 'Other type of role cannot be left blank',
            href: '#organisation[' + index + '][role]'
          })
        }
        roleDetails.otherPartyName = otherParty
      }
      partySelectioData.roles.push(roleDetails)
    }
  })
  if (combinedError.length > 0) {
    partySelectioData.err = combinedError
  }
  return partySelectioData
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

    const partySelectioData = checkEmptySelection(organisations, request, organisationRoles)

    partySelectioData.selectionCount = selectionCount
    if (partySelectioData.err !== undefined) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, partySelectioData)
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_PARTIES, partySelectioData)
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
