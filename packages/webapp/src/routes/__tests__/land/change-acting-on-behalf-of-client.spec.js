import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CHANGE_ACTING_ON_BEHALF_OF_CLIENT

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let changeActingOnBehalfOfClient

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
    changeActingOnBehalfOfClient = require('../../land/change-acting-on-behalf-of-client.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should continue journey to AGENT_ACTING_FOR_CLIENT if user confirms to change acting on behalf of client', async () => {
      const request = {
        yar: redisMap,
        payload: { changeActingOnBehalfOfClient: 'yes' }
      }

      await changeActingOnBehalfOfClient.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.AGENT_ACTING_FOR_CLIENT)
    })
    it('Should continue journey to CHECK_LEGAL_AGREEMENT_DETAILS if user does not want to change acting on behalf of client', async () => {
      const request = {
        yar: redisMap,
        payload: { changeActingOnBehalfOfClient: 'no' }
      }

      await changeActingOnBehalfOfClient.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_APPLICANT_INFORMATION)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await changeActingOnBehalfOfClient.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHANGE_ACTING_ON_BEHALF_OF_CLIENT)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you want to change whether you’re acting on behalf of a client', href: '#changeActingOnBehalfOfClient' })
    })
  })
})
