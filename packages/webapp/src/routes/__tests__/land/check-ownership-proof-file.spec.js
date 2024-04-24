import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants.js'
import checkOwnershipProofFile from '../../../routes/land/check-ownership-proof-file'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import * as azureStorage from '../../../utils/azure-storage.js'
import { getServer } from '../../../../.jest/setup.js'
import onPreAuth from '../../../__mocks__/on-pre-auth.js'
const url = constants.routes.CHECK_PROOF_OF_OWNERSHIP
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  describe('GET', () => {
    let h, redisMap, viewResult, resultContext
    beforeEach(() => {
      redisMap = new Map()
      h = {
        view: (view, context) => {
          viewResult = view
          resultContext = context
        },
        redirect: (view, context) => {
          viewResult = view
          resultContext = context
        }
      }

      redisMap.set(constants.cacheKeys.LAND_OWNERSHIP_PROOFS, [{
        fileName: 'file-1.doc',
        fileLocation: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/file-1.doc',
        fileSize: 0.01,
        fileType: 'application/msword',
        id: '1'
      },
      {
        fileLocation: null,
        fileSize: 0.01,
        fileType: 'application/pdf',
        id: '2'
      }])
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url }, 302)
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        url,
        headers: {
          referer: constants.routes.CHECK_AND_SUBMIT
        }
      }, 302)
    })

    it('should show correct land ownership proofs', async () => {
      redisMap.set(constants.cacheKeys.TEMP_LAND_OWNERSHIP_PROOF, {
        fileName: 'file-1.doc',
        fileLocation: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/file-1.doc',
        fileSize: 0.01,
        fileType: 'application/msword',
        id: '1'
      })
      const request = {
        yar: redisMap,
        query: { id: '1' }
      }

      await checkOwnershipProofFile[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_PROOF_OF_OWNERSHIP)
      expect(resultContext.fileName).toEqual('file-1.doc')
    })

    it('should not show land ownership proofs if file location is null', async () => {
      redisMap.set(constants.cacheKeys.LAND_OWNERSHIP_PROOFS, [{
        fileName: '',
        fileLocation: null,
        fileSize: 0.01,
        fileType: 'application/msword',
        id: '1'
      }])

      const request = {
        yar: redisMap,
        query: { id: '1' }
      }

      await checkOwnershipProofFile[0].handler(request, h)

      expect(viewResult).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })

    it('should redirect to the register task list if required data is not found', async () => {
      redisMap.set(constants.cacheKeys.LAND_OWNERSHIP_PROOFS, [])
      const request = {
        yar: redisMap,
        query: { id: '2' }
      }

      await checkOwnershipProofFile[0].handler(request, h)

      expect(viewResult).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
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
      const session = new Session()
      postOptions.payload.checkLandOwnership = 'yes'
      await getServer().register(onPreAuth(session))
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative land ownership file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkLandOwnership = 'no'
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_LAND_OWNERSHIP)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
    it('If landowner then should redirect to registered_landowner', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkOwnershipProofFile[1].handler
          const session = new Session()
          session.set(constants.cacheKeys.ROLE_KEY, 'Landowner')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_PROOFS, [])
          session.set(constants.cacheKeys.TEMP_LAND_OWNERSHIP_PROOF, {
            fileName: 'file-1.doc',
            fileLocation: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/file-1.doc',
            fileSize: 0.01,
            fileType: 'application/msword',
            id: '1',
            confirmed: false
          })
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
          const request = {
            yar: session,
            query: { id: '1' },
            payload
          }
          await postHandler(request, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.LAND_OWNERSHIP_PROOF_LIST])
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
          session.set(constants.cacheKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
          session.set(constants.cacheKeys.ROLE_KEY, 'Landowner')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')
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
          const request = {
            yar: session,
            query: { id: '1' },
            payload
          }
          await postHandler(request, h)
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
          session.set(constants.cacheKeys.ROLE_KEY, 'Other')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')
          session.set(constants.cacheKeys.TEMP_LAND_OWNERSHIP_PROOF, {
            fileName: 'file-3.doc',
            fileLocation: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/file-1.doc',
            fileSize: 0.01,
            fileType: 'application/msword',
            id: '1',
            confirmed: false
          })
          session.set(constants.cacheKeys.LAND_OWNERSHIP_PROOFS, [{
            fileName: 'file-3.doc',
            fileLocation: '800376c7-8652-4906-8848-70a774578dfe/land-ownership/file-1.doc',
            fileSize: 0.01,
            fileType: 'application/msword',
            id: '1'
          }])
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
          const request = {
            yar: session,
            query: { id: '1' },
            payload
          }
          await postHandler(request, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.LAND_OWNERSHIP_PROOF_LIST])
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
          session.set(constants.cacheKeys.REFERER, constants.routes.CHECK_AND_SUBMIT)
          session.set(constants.cacheKeys.ROLE_KEY, 'Other')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')

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
          const request = {
            yar: session,
            query: { id: '1' },
            payload
          }
          await postHandler(request, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.CHECK_AND_SUBMIT])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('should redirect to land ownership proof list with unique entries', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkOwnershipProofFile[1].handler
          const session = new Session()
          session.set(constants.cacheKeys.ROLE_KEY, 'Landowner')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_LOCATION, 'test/test.doc')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_FILE_SIZE, '2.5')
          session.set(constants.cacheKeys.LAND_OWNERSHIP_PROOFS, ['test.doc'])

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
          const request = {
            yar: session,
            query: { id: '1' },
            payload
          }
          await postHandler(request, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.LAND_OWNERSHIP_PROOF_LIST])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
