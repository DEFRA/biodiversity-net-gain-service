// import Session from '../../../__mocks__/session.js'
import { submitGetRequest } from '../helpers/server.js'
// import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
// import individualDOB from '../../credits/individual-dob.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    // it(`should render the ${url.substring(1)} view date selected`, async () => {
    //   const redisMap = new Map()
    //   jest.isolateModules(async () => {
    //     redisMap.set(constants.redisKeys.PURCHASE_CREDITS_INDIVIDUAL_DOB, '2020-03-11T00:00:00.000Z')
    //     let viewResult, contextResult
    //     const individualDOB = require('../../credits-purchase/individual-dob.js')
    //     const request = {
    //       yar: redisMap
    //     }
    //     const h = {
    //       view: (view, context) => {
    //         viewResult = view
    //         contextResult = context
    //       }
    //     }
    //     await individualDOB.default[0].handler(request, h)
    //     expect(viewResult).toEqual(constants.views.PURCHASE_CREDITS_INDIVIDUAL_DOB)
    //     expect(contextResult.day).toEqual('11')
    //     expect(contextResult.month).toEqual('03')
    //     expect(contextResult.year).toEqual('2020')
    //   })
    // })
  })
})
