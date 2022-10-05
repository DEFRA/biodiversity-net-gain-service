import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const organisationName = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_ORGANISATION_NAMES)
    const organisationChecked = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_ORGANISATION_NAMES_CHECKED)
    const otherParty = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_OTHER_PARTY_NAMES)

    request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_ORGANISATION_NAMES)
    request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_ORGANISATION_NAMES_CHECKED)
    request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_OTHER_PARTY_NAMES)

    return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
      name: organisationName,
      organisationChecked,
      otherPartyName: otherParty
    })
  },
  post: async (request, h) => {
    const organisationName = request.payload['organisation[0].organisationName']
    const organisationRole = request.payload['organisation[0].role']
    let otherPartyName = request.payload.otherPartyName === undefined ? '' : request.payload.otherPartyName
    let organisationError
    let organisationRoleError
    const organisationChecked = {
      County_Council: false,
      Developer: false,
      Landowner: false,
      Responsible_body: false,
      Other: false
    }
    if (organisationName.length === 0) {
      organisationError = {
        text: 'Enter the name of the legal party',
        href: '#organisationName'
      }
    }
    if (organisationRole === undefined || organisationRole.length === 0) {
      organisationRoleError = {
        text: 'Select the role',
        href: '#role'
      }
    }
    if (organisationRole === 'Other' && otherPartyName.length === 0) {
      organisationRoleError = {
        text: 'Other type of role cannot be left blank',
        href: '#other-party-text'
      }
    } else if (organisationRole !== 'Other') {
      otherPartyName = ''
    }
    organisationChecked[organisationRole.trim().replaceAll(' ', '_')] = true
    if (organisationError || organisationRoleError) {
      return h.view(constants.views.ADD_LEGAL_AGREEMENT_PARTIES, {
        err: [organisationError, organisationRoleError],
        name: organisationName,
        organisationChecked,
        otherPartyName
      })
    } else {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_ORGANISATION_NAMES, organisationName)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_OTHER_PARTY_NAMES, otherPartyName)
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_ORGANISATION_NAMES_CHECKED, organisationChecked)
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
