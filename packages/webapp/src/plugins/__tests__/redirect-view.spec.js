import { getServer } from '../test-utils/setup.js'
import constants from '../../utils/constants.js'
import redirectView from '../redirect-view.js'

describe('redirectView plugin', () => {
  let server

  beforeAll(async () => {
    process.env.USE_MOCK_SERVER = 'true'
    server = await getServer()
  })

  afterAll(async () => {
    await server.stop()
  })

  it('is a plugin', async () => {
    expect(redirectView.name).toEqual('redirect-view')
    expect(typeof redirectView.register).toEqual('function')
  })

  it('redirectView method should set VIEW_DATA and redirect', async () => {
    server.route({
      method: 'GET',
      path: '/redirect',
      handler: (request, h) => {
        return h.redirectView('/test', { key: 'value' })
      }
    })

    const response = await server.inject({
      method: 'GET',
      url: '/redirect'
    })

    expect(response.statusCode).toEqual(302)
    expect(response.headers.location).toEqual('/redirect')
  })

  it('onPreResponse should render view with data if redirectViewUsed is true', async () => {
    const mockView = jest.fn().mockReturnValue('Rendered view')
    server.decorate('toolkit', 'view', mockView)

    server.route({
      method: 'GET',
      path: '/prerender',
      handler: (request, h) => {
        request.redirectViewUsed = true
        request.yar.set(constants.redisKeys.VIEW_DATA, { data: { key: 'value' }, route: 'test-view' })
        return h.continue
      }
    })

    const response = await server.inject({
      method: 'GET',
      url: '/prerender'
    })

    expect(response.statusCode).toEqual(200)
    expect(response.result).toEqual('Rendered view')

    expect(mockView).toHaveBeenCalledWith('test-view', { key: 'value' })
  })

  it('onPostHandler should clear VIEW_DATA if request method is POST and redirectViewUsed is true', async () => {
    server.route({
      method: 'POST',
      path: '/postclear',
      handler: (request, h) => {
        request.redirectViewUsed = true
        request.yar.set(constants.redisKeys.VIEW_DATA, { key: 'value' })
        return h.response('Post handler').code(200)
      }
    })

    const postResponse = await server.inject({
      method: 'POST',
      url: '/postclear'
    })

    expect(postResponse.statusCode).toEqual(200)

    const yar = postResponse.request.yar
    expect(yar.get(constants.redisKeys.VIEW_DATA)).toBeNull()
  })
})
