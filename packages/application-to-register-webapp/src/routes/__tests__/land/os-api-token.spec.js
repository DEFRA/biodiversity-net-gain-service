import { getBearerToken } from '@defra/bng-utils-lib'
import { submitGetRequest } from '../helpers/server.js'

const url = '/land/os-api-token'

jest.mock('@defra/bng-utils-lib')

describe(url, () => {
  it('should make a call to retrieve an Ordnance Survey API token', async () => {
    getBearerToken.mockReturnValue(({
      data: {},
      status: 200,
      statusText: 'OK'
    }))
    await submitGetRequest({ url })
    expect(getBearerToken).toHaveBeenCalled()
  })
})
