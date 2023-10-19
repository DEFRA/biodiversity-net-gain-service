import authMock from '../auth-mock.js'

describe('auth-mock', ()=>{
  it('Should mock the auth util with getAuthenticationUrl', ()=> {
    jest.isolateModules(() => {
      const auth = require('../auth')
      authMock(auth)
      expect(auth.getAuthenticationUrl()).toEqual('/signin/callback')
    })
  })
  it('Should mock the auth util with authenticate mocked function', ()=> {
    jest.isolateModules(() => {
      const auth = require('../auth')
      authMock(auth)
      const token = auth.authenticate({}, { set: () => {}})
      expect(typeof token.idTokenClaims.exp).toBe('number')
      expect(token.idTokenClaims.email).toEqual('johnsmith@email.com')
      expect(token.idTokenClaims.contactId).not.toBeNull()
      expect(token.idTokenClaims.firstName).toEqual('John')
      expect(token.idTokenClaims.lastName).toContain('Smith -')
    })
  })
})