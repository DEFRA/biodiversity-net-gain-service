import primaryPage from '../primary-page.js'
import * as constants from '../../utils/constants'

describe('primaryPage', () => {
  beforeAll(async () => {
    process.env.USE_MOCK_SERVER = 'true'
  })

  let server
  let request
  let h

  beforeEach(() => {
    server = {
      ext: jest.fn()
    }

    request = {
      yar: {
        get: jest.fn(),
        set: jest.fn()
      },
      path: ''
    }

    h = {
      continue: 'CONTINUE'
    }
  })

  it('should register the onPostHandler extension on the server', () => {
    primaryPage.register(server, {})

    expect(server.ext).toHaveBeenCalledWith('onPostHandler', expect.any(Function))
  })

  describe('onPostHandler', () => {
    let onPostHandler

    beforeEach(() => {
      primaryPage.register(server, {})
      onPostHandler = server.ext.mock.calls[0][1]
    })

    it('should set PRIMARY_ROUTE if request.path is in primaryPages', () => {
      request.yar.get.mockReturnValue('Registration')
      request.path = constants.default.primaryPages.Registration[0]

      const response = onPostHandler(request, h)

      expect(request.yar.set).toHaveBeenCalledWith(constants.default.redisKeys.PRIMARY_ROUTE, constants.default.primaryPages.Registration[0])
      expect(response).toBe(h.continue)
    })

    it('should not set PRIMARY_ROUTE if request.path is not in primaryPages', () => {
      request.yar.get.mockReturnValue('applicationType1')
      request.path = '/unknownRoute'

      const response = onPostHandler(request, h)

      expect(request.yar.set).not.toHaveBeenCalled()
      expect(response).toBe(h.continue)
    })

    it('should handle application types without target routes', () => {
      request.yar.get.mockReturnValue('unknownApplicationType')
      request.path = '/someRoute'

      const response = onPostHandler(request, h)

      expect(request.yar.set).not.toHaveBeenCalled()
      expect(response).toBe(h.continue)
    })
  })
})
