import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ADD_LANDOWNER_ORGANISATION

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let addLandownerOrganisation

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
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_LPA_LIST, [
      {
        type: 'individual',
        value: { firstName: 'Tom', lastName: 'Smith' }
      },
      { type: 'organisation', value: 'ABC Org' }
    ])

    addLandownerOrganisation = require('../../land/add-landowner-organisation.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should render the organisation view with organisation data to change', async () => {
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }

      await addLandownerOrganisation.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.views.ADD_LANDOWNER_ORGANISATION)
      expect(resultContext.organisationName).toEqual('ABC Org')
    })
  })
  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })
    it('Should continue journey if org name is provided', async () => {
      postOptions.payload.organisationName = 'ABC Organisation'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.LEGAL_AGREEMENT_LPA_LIST)
    })
    it('Should fail journey if no org name is provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Organisation name must be 2 characters or more')
    })
  })
})
