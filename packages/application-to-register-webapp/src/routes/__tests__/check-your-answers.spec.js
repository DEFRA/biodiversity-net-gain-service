import { submitGetRequest } from './helpers/server.js'
import checkYourAnswers from '../../routes/check-your-answers.js'
import constants from '../../utils/constants.js'
const url = '/check-your-answers'

jest.mock('../../utils/http.js')
/*
Tests
  happy
    GET
    POST
      Valid application is sent to backend
  sad
    POST
      invalid application is sent to backend
      Backend returns error response
*/

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    it('Should process a valid application correctly', done => {
      jest.isolateModules(async () => {
        try {
          // pulling in post handler directly to mock session state, there must be a better way to do this via server.inject with session being mocked...
          const postHandler = checkYourAnswers[1].handler

          const http = require('../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              gainSiteReference: 'test-reference'
            }
          })

          const session = new Session()
          session.set('foo', 'bar')
          console.log(session.get('foo'))
          Object.values(constants.redisKeys).forEach((item) => {
            session.set(item, item)
          })
          session.id = 'test'
          let viewArgs = ''; let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ yar: session }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.REGISTRATION_SUBMITTED])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Should fail if backend errors', done => {
      jest.isolateModules(async () => {
        try {
          // pulling in post handler directly to mock session state, there must be a better way to do this via server.inject with session being mocked...
          const postHandler = checkYourAnswers[1].handler

          const http = require('../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            throw new Error('test error')
          })

          const session = new Session()
          session.set('foo', 'bar')
          console.log(session.get('foo'))
          Object.values(constants.redisKeys).forEach((item) => {
            session.set(item, item)
          })
          session.id = 'test'

          let viewArgs = ''; let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ yar: session }, h)
          expect(viewArgs).toEqual(['check-your-answers', { err: [{ href: null, text: 'There is a problem' }] }])
          expect(redirectArgs).toEqual('')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})

class Session {
  constructor () {
    this.values = []
  }

  get (name) {
    return this.values[name]
  }

  set (name, value) {
    this.values[name] = value
  }
}
