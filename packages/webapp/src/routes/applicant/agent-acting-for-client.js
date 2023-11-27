import constants from '../../utils/constants.js'
import developerConstants from '../../utils/developer-constants.js'
import lojConstants from '../../utils/loj-constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'
import createJourneyRoutes from '../../utils/create-journey-routes.js'

const allocationRoutePath = `/${developerConstants.commonRoutes.DEVELOPER_AGENT_ACTING_FOR_CLIENT}`
const registrationRoutePath = `/${lojConstants.commonRoutes.AGENT_ACTING_FOR_CLIENT}`

const config = {
  [allocationRoutePath]: {
    cacheKey: constants.redisKeys.DEVELOPER_IS_AGENT,
    post: {
      yes: {
        redirect: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS
      },
      no: {
        redirect: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION
      }
    }
  },
  [registrationRoutePath]: {
    preProcessor: request => {
      processRegistrationTask(request, {
        taskTitle: 'Applicant information',
        title: 'Add details about the applicant'
      }, {
        status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
        inProgressUrl: registrationRoutePath
      })
    },
    cacheKey: constants.redisKeys.IS_AGENT,
    post: {
      yes: {
        redirect: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS
      },
      no: {
        redirect: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION
      }
    }
  }
}

const handlers = {
  get: async (request, h) => {
    const journeyConfig = config[request.path]
    journeyConfig.preProcessor && journeyConfig.preProcessor(request)
    const isApplicantAgent = request.yar.get(journeyConfig.cacheKey)
    return h.view(constants.views.AGENT_ACTING_FOR_CLIENT, {
      isApplicantAgent
    })
  },
  post: async (request, h) => {
    const journeyConfig = config[request.path]
    const { isApplicantAgent } = request.payload

    // Force replay of full journey if switching between agent and non-agent application
    if (request.yar.get(journeyConfig.cacheKey) !== isApplicantAgent) {
      request.yar.clear(constants.redisKeys.REFERER)
    }

    request.yar.set(journeyConfig.cacheKey, isApplicantAgent)

    if (isApplicantAgent === 'yes' || isApplicantAgent === 'no') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || journeyConfig.post[isApplicantAgent].redirect)
    } else {
      return h.view(constants.views.AGENT_ACTING_FOR_CLIENT, {
        isApplicantAgent,
        err: [{
          text: 'Select yes if you are an agent acting on behalf of a client',
          href: '#isApplicantAgent'
        }]
      })
    }
  }
}

export default createJourneyRoutes([{
  method: 'GET',
  path: registrationRoutePath,
  handler: handlers.get
}, {
  method: 'POST',
  path: registrationRoutePath,
  handler: handlers.post
}], { allocationRoutePath })
