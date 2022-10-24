import { postJson } from '../http.js'
jest.mock('@hapi/wreck')

describe('http', () => {
  it('postJson should handle a 200 response code', () => {
    jest.isolateModules(async () => {
      const wreck = require('@hapi/wreck')
      wreck.post = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve({
            res: {
              statusCode: 200
            },
            payload: '{ "foo": "bar" }'
          })
        })
      })

      const response = await postJson('/', {})
      expect(response).toEqual({ foo: 'bar' })
    })
  })
  it('postJson should handle a non 200 response code as an error', () => {
    jest.isolateModules(async () => {
      const wreck = require('@hapi/wreck')
      wreck.post = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve({
            res: {
              statusCode: 400
            }
          })
        })
      })

      await expect(postJson('/', {}))
        .rejects
        .toThrow('Requested resource returned a non 200 status code')
    })
  })
})
