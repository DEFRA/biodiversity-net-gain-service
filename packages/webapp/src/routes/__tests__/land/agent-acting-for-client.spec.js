import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import developerConstants from '../../../utils/developer-constants.js'
import lojConstants from '../../../utils/loj-constants.js'
const journeys = [
  {
    url: lojConstants.commonRoutes.AGENT_ACTING_FOR_CLIENT,
    expectedYesResult: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
    expectedNoResult: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
    expectedFailureResult: constants.views.AGENT_ACTING_FOR_CLIENT
  },
  {
    url: developerConstants.commonRoutes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
    expectedYesResult: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
    expectedNoResult: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
    expectedFailureResult: constants.views.AGENT_ACTING_FOR_CLIENT
  }
]

describe('agent-acting-for-client', () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let isApplicantAgent

  beforeEach(() => {
    h = {
      view: (view, context) => {
        viewResult = view
        resultContext = context
      },
      redirect: (view, context) => {
        viewResult = view
      }
    }

    redisMap = new Map()
    redisMap.set(constants.redisKeys.IS_AGENT, 'yes')

    isApplicantAgent = require('../../applicant/agent-acting-for-client.js')
  })

  journeys.forEach(journey => {
    const url = journey.url
    describe('GET', () => {
      it(`should render the ${url.substring(1)} view`, async () => {
        await submitGetRequest({ url })
      })
    })

    describe('POST', () => {
      it('Should continue journey to applicant-details-confirm if yes is chosen', async () => {
        const request = {
          path: url,
          yar: redisMap,
          payload: { isApplicantAgent: 'yes' }
        }

        await isApplicantAgent.default[1].handler(request, h)

        expect(viewResult).toEqual(journey.expectedYesResult)
      })

      it('Should continue journey to applying-individual-organisation if no is chosen', async () => {
        const request = {
          path: url,
          yar: redisMap,
          payload: { isApplicantAgent: 'no' }
        }

        await isApplicantAgent.default[1].handler(request, h)

        expect(viewResult).toEqual(journey.expectedNoResult)
      })

      it('Should fail journey if no answer', async () => {
        const request = {
          path: url,
          yar: redisMap,
          payload: { }
        }

        await isApplicantAgent.default[1].handler(request, h)

        expect(viewResult).toEqual(journey.expectedFailureResult)
        expect(resultContext.err[0]).toEqual({ text: 'Select yes if you are an agent acting on behalf of a client', href: '#isApplicantAgent' })
      })
    })
  })
})
