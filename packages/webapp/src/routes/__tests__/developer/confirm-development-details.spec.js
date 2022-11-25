import Session from '../helpers/session.js'
import constants from '../../../utils/constants.js'
import { submitPostRequest } from '../helpers/server.js'
import confirmDevDetails from '../../developer/confirm-development-details.js'

jest.mock('@defra/bng-connectors-lib')

const url = constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/metric-file'
const startPageData = {
  startPage: {
    'Planning authority': 'Your District Council ',
    'Project name': 'A Major Development',
    Applicant: 'A Developer',
    'Application type': 'Outline Planning',
    'Planning application reference': 'A111111',
    Assessor: 'A.Junior',
    Reviewer: 'A.Senior',
    'Metric version': 'v1.1',
    'Assessment date': 44441,
    'Planning authority reviewer': 'A.N.Officer',
    'Cell style conventions': undefined,
    'Enter data': undefined,
    'Automatic lookup': undefined,
    Result: undefined
  }
}
describe(url, () => {
  describe('GET', () => {
    // it(`should render the ${url.substring(1)} view`, async () => {
    //   await submitGetRequest({ url })
    // })

    it.skip(`should render the ${url.substring(1)} view`, async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const confirmDevelopmentDetails = require('../../developer/confirm-development-details.js')
        const redisMap = new Map()
        redisMap.set(constants.redisKeys.DEVELOPER_METRIC_DATA, mockDataPath)
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await confirmDevelopmentDetails.default[0].handler(request, h)
        await confirmDevelopmentDetails.getMetricFileDataAsObject(mockDataPath)
        expect(viewResult).toEqual(constants.views.DEVELOPER_CONFIRM_DEV_DETAILS)
        expect(contextResult.startPage).toEqual(startPageData.startPage)
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
    it('should allow confirmation that the correct metric filehas been uploaded', async () => {
      postOptions.payload.confirmDevDetails = constants.confirmLandBoundaryOptions.YES
      await submitPostRequest(postOptions)
    })

    it('should allow an alternative metric file to be uploaded ', async () => {
      postOptions.payload.confirmDevDetails = constants.CONFIRM_DEVELOPMENT_DETAILS.NO
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.DEVELOPER_UPLOAD_METRIC)
    })

    it('should detect an invalid response from user', async () => {
      postOptions.payload.confirmDevDetails = 'invalid'
      await submitPostRequest(postOptions, 500)
    })
    it('Ensure page uses referrer if is set on post', done => {
      jest.isolateModules(async () => {
        try {
          const postHandler = confirmDevDetails[1].handler
          const session = new Session()
          session.set(constants.redisKeys.DEVELOPER_METRIC_DATA, startPageData.startPage)
          session.set('filename', constants.redisKeys.METRIC_LOCATION)
          const payload = {
            confirmDevDetails: 'yes'
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
          expect(redirectArgs[0]).toEqual('/' + undefined)
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
