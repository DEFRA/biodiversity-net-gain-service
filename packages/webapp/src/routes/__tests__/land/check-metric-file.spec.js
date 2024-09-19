import Session from '../../../__mocks__/session.js'
import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import checkMetricFile from '../../land/check-metric-file.js'
import * as azureStorage from '../../../utils/azure-storage.js'
const url = constants.routes.CHECK_UPLOAD_METRIC
jest.mock('../../../utils/azure-storage.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should redirect to the developer journey task list if a developer journey is in progress', async () => {
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.ALLOCATION)
      const response = await submitGetRequest({ url }, 302, Object.fromEntries(redisMap))
      expect(response.headers.location).toEqual(constants.routes.DEVELOPER_TASKLIST)
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
    it('should allow confirmation that the correct metric file has been uploaded', async () => {
      postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.YES
      const sessionData = {}
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
      await submitPostRequest(postOptions, 302, sessionData)
    })

    it('should allow an alternative metric file to be uploaded ', async () => {
      const spy = jest.spyOn(azureStorage, 'deleteBlobFromContainers')
      postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.NO
      const sessionData = {}
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
      const response = await submitPostRequest(postOptions, 302, sessionData)
      expect(response.headers.location).toBe(constants.routes.UPLOAD_METRIC)
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should detect an invalid response from user', async () => {
      postOptions.payload.confirmGeospatialLandBoundary = 'invalid'
      const sessionData = {}
      sessionData[constants.redisKeys.APPLICATION_TYPE] = constants.applicationTypes.REGISTRATION
      await submitPostRequest(postOptions, 500, sessionData)
    })
    it('Ensure page uses referrer if is set on post', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = checkMetricFile[1].handler
          const session = new Session()
          session.set(constants.redisKeys.REFERER, '/land/check-and-submit')
          session.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
          const payload = {
            checkUploadMetric: 'yes'
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

          await postHandler({ payload, yar: session, path: checkMetricFile[1].path }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs[0]).toEqual('/land/check-and-submit')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('clears any matched habitats if the user selects no', async () => {
      postOptions.payload.checkUploadMetric = constants.confirmLandBoundaryOptions.NO
      const sessionData = {
        [constants.redisKeys.APPLICATION_TYPE]: constants.applicationTypes.REGISTRATION,
        [constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS]: {
          habitatType: 'Sparsely vegetated land - Calaminarian grasslands',
          condition: 'Good',
          sheet: 'd3',
          module: 'Enhanced',
          state: 'Habitat',
          id: '0',
          size: 2,
          measurementUnits: 'hectares',
          rowNum: 12,
          processed: false
        },
        [constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE]: true
      }
      await submitPostRequest(postOptions, 302, sessionData)
      expect(sessionData).not.toHaveProperty(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
      expect(sessionData).not.toHaveProperty(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE)
    })
  })
})
