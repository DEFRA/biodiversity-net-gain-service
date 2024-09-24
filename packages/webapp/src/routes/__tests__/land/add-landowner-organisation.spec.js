import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.ADD_LANDOWNER_ORGANISATION

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let addLandownerOrganisations

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS, [{
      organisationName: 'org1',
      emailAddress: 'me@me.com'
    }, {
      organisationName: 'org2',
      emailAddress: 'me1@me.com'
    }])
    addLandownerOrganisations = require('../../land/add-landowner-organisation.js')
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
    it(`should render the ${url.substring(1)} view with landowner organisation that user wants to change`, async () => {
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }
      await addLandownerOrganisations.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_ORGANISATION)
      expect(resultContext.organisation.organisationName).toEqual('org1')
    })

    it(`should render the ${url.substring(1)} view without landowners`, async () => {
      const request = {
        yar: redisMap,
        query: {}
      }
      await addLandownerOrganisations.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_ORGANISATION)
    })
  })

  describe('POST', () => {
    it('should add landowner to legal agreement and redirect to CHECK_LANDOWNERS page', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'org3',
          emailAddress: 'me@me.com'
        },
        query: {}
      }

      await addLandownerOrganisations.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LANDOWNERS)
    })
    it('should add landowner to legal agreement and redirect to COMBINED_CASE_CHECK_LANDOWNERS page when this is a combined case request', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'org3',
          emailAddress: 'me@me.com'
        },
        query: {},
        _route: {
          path: '/combined-case/add-landowner-organisation'
        }
      }

      await addLandownerOrganisations.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.reusedRoutes.COMBINED_CASE_CHECK_LANDOWNERS)
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
          organisationName: 'org4',
          emailAddress: 'me@me.com'

        },
        query: { id: '0' }
      }

      await addLandownerOrganisations.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CHECK_LANDOWNERS)
    })

    it('should fail to add landowner to legal agreement without landowner organisation name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: ''
        },
        query: {}
      }

      await addLandownerOrganisations.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_ORGANISATION)

      expect(resultContext.err[0]).toEqual({ text: 'Enter the organisation name of the landowner or leaseholder', href: '#organisationName' })
    })
    it('should fail to add landowner to legal agreement with duplicate organisation name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'org1',
          emailAddress: 'me@me.com'
        },
        query: {}
      }

      await addLandownerOrganisations.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_ORGANISATION)

      expect(resultContext.err).toEqual([{ href: '#organisationName', text: 'This organisation has already been added - enter a different organisation, if there is one' }])
    })
    it('should fail to add landowner to legal agreement without landowner email', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'org2'
        },
        query: {}
      }

      await addLandownerOrganisations.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_ORGANISATION)
      expect(resultContext.err[0]).toEqual({ text: 'Enter your email address', href: '#emailAddress' })
    })
    it('should fail to edit landowner to legal agreement with duplicate organisation name', async () => {
      const request = {
        yar: redisMap,
        payload: {
          organisationName: 'org2',
          emailAddress: 'me@me.com'
        },
        query: { id: '0' }
      }

      await addLandownerOrganisations.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_ORGANISATION)

      expect(resultContext.err).toEqual([{ href: '#organisationName', text: 'This organisation has already been added - enter a different organisation, if there is one' }])
    })
  })
})
