import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.BIODIVERSITY_GAIN_SITES

jest.mock('../../../utils/http.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          jest.resetAllMocks()
          jest.mock('../../../utils/http.js')
          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return [{
              applicationReference: 'mock application reference 1',
              lastUpdated: new Date(),
              applicationStatus: 'IN PROGRESS'
            }, {
              applicationReference: 'mock application reference 2',
              lastUpdated: new Date(),
              applicationStatus: 'SUBMITTED'
            }]
          })
          await submitGetRequest({ url }, 200, null, { expectedNumberOfPostJsonCalls: 1 })
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
