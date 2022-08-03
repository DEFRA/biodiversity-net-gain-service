import getBearerToken from '../get-bearer-token.js'
import axios from 'axios'

jest.mock('axios')

const baseConfig = {
  clientId: 'mockClientId',
  clientSecret: 'mockClientSecret'
}

const mockReturnValue = {
  data: {},
  status: 200,
  statusText: 'OK'
}

describe('A request for a bearer token', () => {
  it('should result in a REST API call when a scope is included', async () => {
    axios.request.mockReturnValue(mockReturnValue)
    const config = Object.assign({ scope: 'mockScope' }, baseConfig)
    await getBearerToken(config)
    expect(axios.request).toHaveBeenCalled()
  })

  it('should result in a REST API call when a scope is not included', async () => {
    axios.request.mockReturnValue(mockReturnValue)
    await getBearerToken(baseConfig)
    expect(axios.request).toHaveBeenCalled()
  })
})
