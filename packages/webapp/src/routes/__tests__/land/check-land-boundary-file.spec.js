import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import checkLandBoundaryFile from '../../land/check-land-boundary-file.js'
const url = constants.routes.CHECK_LAND_BOUNDARY

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
    it('should allow confirmation that the correct land boundary file has been uploaded', async () => {
      postOptions.payload.checkLandBoundary = constants.confirmLandBoundaryOptions.YES
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative land boundary file to be uploaded ', async () => {
      postOptions.payload.checkLandBoundary = constants.confirmLandBoundaryOptions.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_LAND_BOUNDARY)
    })

    it('should detect an invalid response from user', async () => {
      postOptions.payload.confirmGeospatialLandBoundary = 'invalid'
      await submitPostRequest(postOptions, 500)
    })
    it('Ensure page uses referer if is set on post and grid reference is present', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkLandBoundaryFile[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
          session.set(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE, 'ST123456')
          const payload = {
            checkLandBoundary: 'yes'
          }
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

          await postHandler({ payload, yar: session }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs[0]).toEqual(constants.routes.CHECK_AND_SUBMIT)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Ensure page doesn\'t use referer if grid reference is missing', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkLandBoundaryFile[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
          const payload = {
            checkLandBoundary: 'yes'
          }
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

          await postHandler({ payload, yar: session }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs[0]).toEqual(constants.routes.ADD_GRID_REFERENCE)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
