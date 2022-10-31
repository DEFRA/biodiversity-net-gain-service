import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import Session from '../helpers/session.js'
import constants from '../../../utils/constants.js'
import name from '../../../routes/land/name.js'
const url = constants.routes.NAME

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        headers: {
          referer: constants.routes.CHECK_YOUR_DETAILS
        },
        url
      })
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
    it('Should continue journey if full name is provided', async () => {
      postOptions.payload.fullName = 'John Smith'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/land/role')
    })
    it('Should fail journey if no name provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter your full name')
    })
    it('Should fail journey if only 1 character provided', async () => {
      postOptions.payload.fullName = 'J'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Full name must be 2 characters or more')
    })
    it('Should return to check your answer page if referrer is set', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = name[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, constants.routes.CHECK_YOUR_DETAILS)
          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ yar: session, payload: { fullName: 'John Smith' } }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.CHECK_YOUR_DETAILS])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
