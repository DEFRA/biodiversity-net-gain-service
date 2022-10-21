import constants from '../../utils/constants.js'
import path from 'path'
import moment from 'moment'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.LEGAL_AGREEMENT_SUMMARY, context)
  },
  post: async (request, h) => {
    const context = await getContext(request)
    return h.redirect(`${constants.views.LEGAL_AGREEMENT_SUMMARY}`, context)
  }
}

const getContext = async request => {
  return {
    legalAgreementType: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
    legalAgreementFileName: getLegalAgreementFileName(request),
    partyNameAndRole: getNameAndRoles(request),
    legalAgreementStartDate: getLegalAgreementDate(request)
  }
}

function getNameAndRoles (request) {
  const partySelectionData = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
  const partySelectionContent = []
  partySelectionData.organisations.forEach((organisation, index) => {
    const selectedRole = partySelectionData.roles[index]
    const roleName = selectedRole.value !== undefined ? selectedRole.value : selectedRole.otherPartyName
    partySelectionContent.push(`${organisation.value} (${roleName})`)
  })
  return partySelectionContent
}

function getLegalAgreementFileName (request) {
  const fileLocation = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
  return path.parse(fileLocation).base
}

function getLegalAgreementDate (request) {
  const date = moment(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DATE_KEY))

  return date.toDate().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_SUMMARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_SUMMARY,
  handler: handlers.post
}]
