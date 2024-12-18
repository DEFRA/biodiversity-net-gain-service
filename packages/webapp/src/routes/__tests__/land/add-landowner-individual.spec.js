import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import { SessionMap } from '../../../utils/sessionMap.js'

const url = constants.routes.ADD_LANDOWNER_INDIVIDUAL

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let addLandownerIndividuals

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
      firstName: 'John',
      lastName: 'Ken',
      emailAddress: 'me@me.com',
      type: 'individual'
    }, {
      firstName: 'Crishn',
      lastName: 'P',
      emailAddress: 'me1@me.com',
      type: 'individual'
    }])

    addLandownerIndividuals = require('../../land/add-landowner-individual.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
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
    it(`should render the ${url.substring(1)} view with landowner individuals that user wants to change`, async () => {
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }
      await addLandownerIndividuals.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)
      expect(resultContext.individual.firstName).toEqual('John')
    })

    it(`should render the ${url.substring(1)} view without landowners`, async () => {
      const request = {
        yar: redisMap,
        query: {}
      }
      await addLandownerIndividuals.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)
    })
  })

  describe('POST', () => {
    it('should add landowner to legal agreement and redirect to CHECK_LANDOWNERS page', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: 'Crishn',
          lastName: 'Ps',
          emailAddress: 'me@me.com'
        },
        query: {},
        path: addLandownerIndividuals.default[1].path
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LANDOWNERS)
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

    it('should edit landowner to legal agreement and redirect to CHECK_LANDOWNERS page by using id', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: 'Crish',
          lastName: 'P',
          emailAddress: 'me@me.com'
        },
        query: { id: '0' },
        path: addLandownerIndividuals.default[1].path
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LANDOWNERS)
    })

    it('should fail to add landowner to legal agreement without landowner first name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: '',
          lastName: 'P'
        },
        query: {}
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)

      expect(resultContext.err[0]).toEqual({ text: 'Enter the first name of the landowner or leaseholder', href: '#firstName' })
    })

    it('should fail to add landowner to legal agreement without landowner last name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: 'Cris',
          lastName: ''
        },
        query: {}
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)

      expect(resultContext.err[0]).toEqual({ text: 'Enter the last name of the landowner or leaseholder', href: '#lastName' })
    })
    it('should fail to add landowner to legal agreement without landowner email', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: 'Cris',
          lastName: 'lsl'
        },
        query: {}
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)
      expect(resultContext.err[0]).toEqual({ text: 'Enter your email address', href: '#emailAddress' })
    })
    it('should fail to add landowner to legal agreement with landowner first name length > 50', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: 'xvcxvcv cxvcvczvxvxvcvxcvvbbcb cxbbvcbvfbvcxxvcbvbbvbc cbxbbbbb cxbvbvbvcbbncbncbvnnvn',
          lastName: 'P'
        },
        query: {}
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)

      expect(resultContext.err[0]).toEqual({ text: 'First name must be 50 characters or fewer', href: '#firstName' })
    })

    it('should fail to add landowner to legal agreement with landowner first name length > 50', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: 'xvcxvcv cxvcvczvxvxvcvxcvvbbcb cxbbvcbvfbvcxxvcbvbbvbc cbxbbbbb cxbvbvbvcbbncbncbvnnvn',
          lastName: 'P'
        },
        query: {}
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)

      expect(resultContext.err[0]).toEqual({ text: 'First name must be 50 characters or fewer', href: '#firstName' })
    })
    it('should fail to add landowner to legal agreement with duplicate landowner name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: 'Crishn',
          lastName: 'P',
          emailAddress: 'me@me.com'
        },
        query: {}
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)

      expect(resultContext.err).toEqual([{ href: '#personName', text: 'This landowner or leaseholder has already been added - enter a different landowner or leaseholder, if there is one' }])
    })
    it('should fail to edit landowner to legal agreement with duplicate landowner name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          firstName: 'Crishn',
          lastName: 'P',
          emailAddress: 'me@me.com'
        },
        query: { id: '0' }
      }

      await addLandownerIndividuals.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_INDIVIDUAL)

      expect(resultContext.err).toEqual([{ href: '#personName', text: 'This landowner or leaseholder has already been added - enter a different landowner or leaseholder, if there is one' }])
    })
  })
})
