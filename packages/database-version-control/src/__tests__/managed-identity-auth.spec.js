const managedIdentityAuth = require('../managed-identity-auth')
jest.mock('@azure/identity')

describe('managed identity auth tests', () => {
  it('Should generate a token via getToken method', async () => {
    const { DefaultAzureCredential } = require('@azure/identity')
    DefaultAzureCredential.prototype.getToken = jest.fn().mockImplementation(() => {
      return {
        token: 'abcdef'
      }
    })
    const token = await managedIdentityAuth.getToken()
    expect(token).toEqual('abcdef')
  })
})
