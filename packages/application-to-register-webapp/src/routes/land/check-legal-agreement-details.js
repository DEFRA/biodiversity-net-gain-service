import constants from '../../utils/constants.js'
import path from 'path'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.LEGAL_AGREEMENT_SUMMARY, context)
  },
  post: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, context)
  }
}

const getContext = async request => {
  const legalAgreementDetails = [
    {
      key: {
        text: 'Type of legal agreement '
      },
      value: {
        text: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
      },
      actions: {
        items: [
          {
            href: '#',
            text: 'Change',
            visuallyHiddenText: 'name'
          }
        ]
      }
    },
    {
      key: {
        text: 'Legal agreement file uploaded'
      },
      value: {
        text: getLegalAgreementFileName(request)
      },
      actions: {
        items: [
          {
            href: '#',
            text: 'Change',
            visuallyHiddenText: 'name'
          }
        ]
      }
    },
    {
      key: {
        text: 'Parties involved'
      },
      value: {
        text: getNameAndRoles(request)
      },
      actions: {
        items: [
          {
            href: '#',
            text: 'Change',
            visuallyHiddenText: 'name'
          }
        ]
      }
    },
    {
      key: {
        text: 'Start date'
      },
      value: {
        text: getLegalAgreementDate(request)
      },
      actions: {
        items: [
          {
            href: '#',
            text: 'Change',
            visuallyHiddenText: 'name'
          }
        ]
      }
    }
  ]
  return {
    legalAgreementDetails
  }
}

function getNameAndRoles (request) {
  const partySelectionData = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_PARTIES)
  const partySelectionContent = []
  partySelectionData.organisations.forEach((organisation, index) => {
    partySelectionContent.push(organisation.value + '(' + partySelectionData.roles[index].value + ')')
  })
  return partySelectionContent.join(' ')
}

function getLegalAgreementFileName (request) {
  const fileLocation = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
  return fileLocation === null ? '' : path.parse(fileLocation).base
}

function getLegalAgreementDate (request) {
  const day = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_DAY)
  const month = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_MONTH)
  const year = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_START_YEAR)

  const currentDate = new Date()
  currentDate.setMonth(month - 1)
  currentDate.setDate(day)
  currentDate.setFullYear(year)

  return currentDate.toLocaleDateString('en-GB', {
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
