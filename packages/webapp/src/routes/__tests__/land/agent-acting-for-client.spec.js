import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import { SessionMap } from '../../../utils/sessionMap.js'
const url = constants.routes.AGENT_ACTING_FOR_CLIENT

describe(url, () => {
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
      redirect: (view) => {
        viewResult = view
      }
    }

    redisMap = new SessionMap()
    redisMap.set(constants.redisKeys.IS_AGENT, 'yes')
    redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)

    isApplicantAgent = require('../../land/agent-acting-for-client.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should continue journey to applicant-details-confirm if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { isApplicantAgent: 'yes' },
        path: isApplicantAgent.default[1].path
      }

      await isApplicantAgent.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS)
    })

    it('Should continue journey to applying-individual-organisation if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { isApplicantAgent: 'no' },
        path: isApplicantAgent.default[1].path
      }

      await isApplicantAgent.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: { },
        path: isApplicantAgent.default[1].path
      }

      await isApplicantAgent.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.AGENT_ACTING_FOR_CLIENT)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you are an agent acting on behalf of a client', href: '#isApplicantAgent' })
    })
  })
})
