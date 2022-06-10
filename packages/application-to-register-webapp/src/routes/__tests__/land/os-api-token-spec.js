import axios from 'axios'
import { submitGetRequest } from '../helpers/server.js'

const url = '/land/os-api-token'

jest.mock('axios')

describe(url, () => {
  it('should make a call to retrieve an Ordnance Survey API token', async () => {
    axios.request.mockReturnValue(({
      data: {},
      status: 200,
      statusText: 'OK'
    }))
    await submitGetRequest({ url })
    expect(axios.request).toHaveBeenCalled()
  })
})
