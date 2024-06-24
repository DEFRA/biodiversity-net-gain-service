import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import { SessionMap } from '../../../utils/sessionMap.js'

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

    redisMap = new SessionMap()
    redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
    redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
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
    it('should return an error for empty id in query string', async () => {
      const queryUrl = url + '?id='
      const response = await submitGetRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should return an error for invalid id in query string', async () => {
      const queryUrl = url + '?id=$'
      const response = await submitGetRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
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
          responsibleBodyName: 'test3'
        },
        query: {},
        path: addConcovResponsibleParties.default[1].path
      }

      await addConcovResponsibleParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_RESPONSIBLE_BODIES)
    })
    it('should return an error for empty id in query string', async () => {
      const queryUrl = url + '?id='
      const response = await submitPostRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should return an error for invalid id in query string', async () => {
      const queryUrl = url + '?id=$'
      const response = await submitPostRequest({ url: queryUrl }, 400)
      expect(response.statusCode).toBe(400)
    })
    it('should edit responsibleBody to legal agreement and redirect to CHECK_RESPONSIBLE_BODIES page by using id', async () => {
      const request = {
        yar: redisMap,
        payload: {
          responsibleBodyName: 'test1'
        },
        query: { id: '0' },
        path: addConcovResponsibleParties.default[1].path
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
        query: {},
        path: addConcovResponsibleParties.default[1].path
      }

      await addConcovResponsibleParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT)

      expect(resultContext.err[0]).toEqual({ text: 'Enter the name of the responsible body', href: '#responsibleBody' })
    })
    it('should fail to add responsibleBody to legal agreement with duplicate responsibleBody name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          responsibleBodyName: 'test2'
        },
        query: {},
        path: addConcovResponsibleParties.default[1].path
      }
      await addConcovResponsibleParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT)
      expect(resultContext.err).toEqual({ text: 'This responsible body has already been added - enter a different responsible body, if there is one', href: '#responsibleBody' })
    })
    it('should fail to edit responsibleBody to legal agreement with duplicate responsibleBody name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          responsibleBodyName: 'test2'
        },
        query: { id: '0' },
        path: addConcovResponsibleParties.default[1].path
      }
      await addConcovResponsibleParties.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT)
      expect(resultContext.err).toEqual({ text: 'This responsible body has already been added - enter a different responsible body, if there is one', href: '#responsibleBody' })
    })
  })
})
