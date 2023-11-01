import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.APPLICANT_DETAILS_IS_AGENT

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
      redirect: (view, context) => {
        viewResult = view
      }
    }

    redisMap = new Map()
    redisMap.set(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT, 'yes')

    isApplicantAgent = require('../../land/applicant-details-is-agent.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    // TODO: should change path to next route when dev work is complete
    it.skip('Should continue journey to APPLICANT_DETAILS_CONFIRM if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { isApplicantAgent: 'yes' }
      }

      await isApplicantAgent.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.APPLICANT_DETAILS_IS_AGENT)
    })

    // TODO: should change path to next route when dev work is complete
    it.skip('Should continue journey to APPLICANT_ROLE_AS_LANDOWNER if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { isApplicantAgent: 'no' }
      }

      await isApplicantAgent.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.APPLICANT_DETAILS_IS_AGENT)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: { }
      }

      await isApplicantAgent.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.APPLICANT_DETAILS_IS_AGENT)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want are an agent acting on behalf of a client', href: '#isApplicantAgent' })
    })
  })
})
