import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let addConcovResponsibleParties

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [{
      responsibleBodyName: 'test1'
    },
    {
      responsibleBodyName: 'test2'
    }])

    addConcovResponsibleParties = require('../../land/add-responsible-body-conservation-covenant.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })

    it(`should render the ${url.substring(1)} view with responsible body that user wants to change`, async () => {
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }
      await addConcovResponsibleParties.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT)
      expect(resultContext.responsibleBody.responsibleBodyName).toEqual('test1')
    })

    it(`should render the ${url.substring(1)} view without responsibleBody`, async () => {
      const request = {
        yar: redisMap,
        query: {}
      }
      await addConcovResponsibleParties.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT)
    })
  })

  describe('POST', () => {
    it('should add responsibleBody to legal agreement and redirect to CHECK_RESPONSIBLE_BODIES page', async () => {
      const request = {
        yar: redisMap,
        payload: {
          responsibleBodyName: 'test1'
        },
        query: {}
      }

      await addConcovResponsibleParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_RESPONSIBLE_BODIES)
    })

    it('should edit responsibleBody to legal agreement and redirect to CHECK_RESPONSIBLE_BODIES page by using id', async () => {
      const request = {
        yar: redisMap,
        payload: {
          responsibleBodyName: 'test1'
        },
        query: { id: '0' }
      }

      await addConcovResponsibleParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_RESPONSIBLE_BODIES)
    })

    it('should fail to add responsibleBody to legal agreement without responsibleBody name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          responsibleBody: ''
        },
        query: {}
      }

      await addConcovResponsibleParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT)

      expect(resultContext.err[0]).toEqual({ text: 'Enter the name of the responsible body', href: '#responsibleBody' })
    })
  })
})
