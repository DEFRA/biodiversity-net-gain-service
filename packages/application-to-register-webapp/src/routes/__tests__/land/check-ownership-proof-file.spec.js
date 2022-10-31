import Session from '../helpers/session.js'
import constants from '../../../utils/constants.js'
import checkOwnershipProofFile from '../../../routes/land/check-ownership-proof-file'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_PROOF_OF_OWNERSHIP

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        url,
        headers: {
          referer: constants.routes.CHECK_AND_SUBMIT
        }
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
    it('should allow confirmation that the correct land ownership file has been uploaded', async () => {
      postOptions.payload.checkLandOwnership = 'yes'
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative land ownership file to be uploaded ', async () => {
      postOptions.payload.checkLandOwnership = 'no'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_LAND_OWNERSHIP)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
    it('If landowner then should redirect to registered_landowner', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkOwnershipProofFile[1].handler
          const session = new Session()
          session.set(constants.redisKeys.ROLE_KEY, 'Landowner')
          session.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')

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

          const payload = {
            checkLandOwnership: 'yes'
          }

          await postHandler({ yar: session, payload }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.REGISTERED_LANDOWNER])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('If landowner but has referer then should redirect to referer', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkOwnershipProofFile[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
          session.set(constants.redisKeys.ROLE_KEY, 'Landowner')
          session.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')

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

          const payload = {
            checkLandOwnership: 'yes'
          }

          await postHandler({ yar: session, payload }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.CHECK_AND_SUBMIT])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('If not landowner then redirect to ADD_LANDOWNERS', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkOwnershipProofFile[1].handler
          const session = new Session()
          session.set(constants.redisKeys.ROLE_KEY, 'Other')
          session.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')

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

          const payload = {
            checkLandOwnership: 'yes'
          }

          await postHandler({ yar: session, payload }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.ADD_LANDOWNERS])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('If not landowner and referer then redirect to referer', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkOwnershipProofFile[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
          session.set(constants.redisKeys.ROLE_KEY, 'Other')
          session.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')

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

          const payload = {
            checkLandOwnership: 'yes'
          }

          await postHandler({ yar: session, payload }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.CHECK_AND_SUBMIT])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
