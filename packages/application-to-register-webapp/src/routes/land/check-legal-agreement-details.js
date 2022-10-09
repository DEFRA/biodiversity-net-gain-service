import constants from '../../utils/constants.js'

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
        text: 'Legal agreement type'
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
        text: 'abcagreement.pdf'
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
        text: 'Name (role) '
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
        text: '15 March 2022'
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
    legalAgreementDetails: legalAgreementDetails
  }
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
