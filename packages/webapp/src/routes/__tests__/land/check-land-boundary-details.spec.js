import constants from '../../../utils/constants.js'
import { submitGetRequest, startServer } from '../helpers/server.js'
import serverOptions from '../../../__mocks__/server-options.js'
import onPreHandler from '../../../__mocks__/on-pre-handler.js'

const url = constants.routes.CHECK_LAND_BOUNDARY_DETAILS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('POST', () => {
    it('should flow to register task list', done => {
      jest.isolateModules(async () => {
        try {
          let viewResult
          const redisMap = new Map()
          const checkLandBoundary = require('../../land/check-land-boundary-details')
          const request = {
            yar: redisMap,
            payload: {
              confirmGeospatialLandBoundary: undefined
            }
          }
          const h = {
            redirect: (view, context) => {
              viewResult = view
            }
          }
          await checkLandBoundary.default[1].handler(request, h)
          expect(viewResult).toBe(constants.routes.REGISTER_LAND_TASK_LIST)
          expect(request.yar.get('registrationTaskDetails').taskList.length).toBe(4)
          expect(request.yar.get('registrationTaskDetails').taskList[0].tasks[1].status).toBe('COMPLETED')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})

describe('With disabled routes', () => {
  let server
  const ORIGINAL_ENV = process.env
  let getOptions; const sessionData = {}

  beforeEach(() => {
    sessionData[constants.redisKeys.FULL_NAME] = 'test'
    sessionData[constants.redisKeys.ROLE_KEY] = 'test'
    sessionData[constants.redisKeys.EMAIL_VALUE] = 'test@example.com'
    getOptions = {
      url,
      method: 'GET'
    }
  })

  afterEach(async () => {
    try {
      if (server) {
        await server.stop()
      }
    } finally {
      process.env = { ...ORIGINAL_ENV }
    }
  })

  it('should redirect to upload-geospatial-file if this route not disabled', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'Y'
    server = await startServer({ ...serverOptions, port: 3001 })
    sessionData[constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE] = 'geospatialData'
    server.register(onPreHandler(sessionData))
    const response = await server.inject(getOptions)
    expect(response.payload).toContain('Geospatial file')
  })

  it('should redirect to upload-land-boundary if this route disabled', async () => {
    process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL = 'N'
    server = await startServer({ ...serverOptions, port: 3001 })
    sessionData[constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE] = 'documentOrImage'
    server.register(onPreHandler(sessionData))
    const response = await server.inject(getOptions)
    expect(response.payload).not.toContain('Document or image')
    expect(response.payload).not.toContain('Geospatial file')
  })
})
