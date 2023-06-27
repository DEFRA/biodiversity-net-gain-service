// General file to test out authenticated routes
import { submitGetRequest } from '../helpers/server.js'

describe('Route authentication', () => {
  it('Should render a non protected route without authentication', async () => {
    const options = {
      url: '/start',
      auth: false
    }
    await submitGetRequest(options)
  })

  it('Should redirect to signin route if hitting a protected route without authentication', async () => {
    const options = {
      url: '/land/upload-metric',
      auth: false
    }
    const response = await submitGetRequest(options, 302)
    expect(response.headers.location).toEqual('/signin?next=%2Fland%2Fupload-metric')
  })
})
