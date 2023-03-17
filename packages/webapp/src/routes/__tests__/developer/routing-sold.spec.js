import { submitGetRequest } from '../helpers/server.js'

const url = '/developer/routing-sold'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
        await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let redisMap, postOptions
    beforeEach(() => {
      redisMap = new Map()
      postOptions = {
        url,
        payload: {}
      }
    })

    it.todo('This will cover into next PR')
  })
})
