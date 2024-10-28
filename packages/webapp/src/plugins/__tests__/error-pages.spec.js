import plugin from '../error-pages.js'
import { getServer } from '../../../.jest/setup.js'

describe('error-pages', () => {
  it('is a plugin', () => {
    expect(plugin.name).toEqual('error-pages')
    expect(typeof plugin.register).toEqual('function')
  })

  it('handles 404 for server', async () => {
    const response = await getServer().inject({
      method: 'GET',
      url: '/sdgfdfghdfghdf'
    })
    expect(response.statusCode).toEqual(404)
    expect(response.result).toContain('Page not found')
  })

  it('it handles internal error', async () => {
    const response = await getServer().inject({
      method: 'GET',
      url: '/error'
    })
    expect(response.statusCode).toEqual(500)
    expect(response.result).toContain('Sorry, there is a problem with the service')
  })

  it('handles 500 error with referer /check-and-submit', async () => {
    const response = await getServer().inject({
      method: 'GET',
      url: '/error',
      headers: {
        referer: '/check-and-submit'
      }
    })

    expect(response.statusCode).toEqual(500)
    expect(response.result).toContain('Your application could not be submitted')
    expect(response.result).toContain('Please check your metric file(s)')
  })

  it('should continue processing for non-error responses', async () => {
    const server = await getServer()

    // Send a normal request that should not trigger the custom error handling
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    // Check that the response is normal and no error handling is triggered
    expect(response.statusCode).toEqual(302)
    expect(response.result).toBeDefined()
  })
})
