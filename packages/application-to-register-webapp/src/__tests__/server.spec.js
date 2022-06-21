import { getServer } from '../../.jest/setup.js'

describe('The server', () => {
  it('starts', async () => {
    expect(getServer().info.port).toEqual(3000)
  })

  it('handles a request', async () => {
    const response = await getServer().inject({
      method: 'GET',
      url: '/session'
    })
    expect(response.statusCode).toEqual(200)
    expect(response.payload).toContain('Hello or World?')
  })

  it('handles a request', async () => {
    const response = await getServer().inject({
      method: 'POST',
      url: '/session',
      payload: {
        helloWorld: 'hello'
      }
    })
    expect(response.statusCode).toEqual(302)
  })
})
