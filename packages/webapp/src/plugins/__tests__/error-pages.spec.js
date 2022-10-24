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
  })

  it('it handles internal error', async () => {
    const response = await getServer().inject({
      method: 'GET',
      url: '/error'
    })
    expect(response.statusCode).toEqual(500)
  })
})
