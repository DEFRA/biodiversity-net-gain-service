// Adds mocked functions to the authentication util
import crypto from 'crypto'

const authMock = (auth) => {
  auth.getAuthenticationUrl = () => {
    return '/signin/callback'
  }

  auth.authenticate = (_code, cookieAuth) => {
    // Give cookie a 24 hour expiry
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const contactId = crypto.randomBytes(16).toString('hex')
    const token = {
      idTokenClaims: {
        exp: Math.trunc(tomorrow.getTime() / 1000),
        email: 'johnsmith@email.com',
        contactId,
        firstName: 'John',
        lastName: `Smith - ${contactId}`,
        enrolmentCount: 1,
        currentRelationshipId: 'mock relationship id',
        relationships: ['mock relationship id:::0:Citizen:0'],
        roles: ['mock relationship id:Standard User:2']
      }
    }

    cookieAuth.set({
      account: token
    })
    return token
  }
}

export default authMock
