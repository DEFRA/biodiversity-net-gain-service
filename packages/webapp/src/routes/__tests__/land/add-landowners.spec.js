import constants from '../../../utils/constants.js'

import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.ADD_LANDOWNERS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
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
    it('Should continue journey if owners names added', async () => {
      postOptions.payload.landowners = ['John Smith', 'Jane Doe']
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.LANDOWNER_CONSENT)
    })
    it('Should stop journey if owners names added and last is blank', async () => {
      postOptions.payload.landowners = ['John Smith', 'Jane Doe', '']
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the full name of the landowner')
    })
    it('Should stop journey if no owners', async () => {
      postOptions.payload.landowners = undefined
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the full name of the landowner')
    })
    it('Should stop journey if owner name is blank', async () => {
      postOptions.payload.landowners = ['']
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the full name of the landowner')
    })
    it('Should stop journey if a name is blank, but not last', async () => {
      postOptions.payload.landowners = ['test0', '', 'test3']
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the full name of the landowner')
    })
    // it('should add landowner and redirect to referrer ', async () => {
    //   jest.isolateModules(async () => {
    //     let viewResult
    //     const legalAgreementParties = require('../../land/add-landowners.js')
    //     const redisMap = new Map()
    //     redisMap.set(constants.redisKeys.LAND_OWNERSHIP_KEY, 'http://localhost:3000/land/check-ownership-details')
    //
    //     const request = {
    //       yar: redisMap,
    //       payload: {
    //         landowners: ['John Smith', 'Jane Doe']
    //       }
    //     }
    //     const h = {
    //       redirect: (view, context) => {
    //         viewResult = view
    //       }
    //     }
    //     await legalAgreementParties.default[1].handler(request, h)
    //     expect(viewResult).toEqual(constants.routes.CHECK_OWNERSHIP_DETAILS)
    //   })
    // })
  })
})
