import { submitGetRequest } from './helpers/server.js'
import constants from '../../utils/constants.js'
const url = constants.routes.SIGNED_OUT

describe(url, () => {
  describe('GET', () => {
    it('should render the signed-out view with default content when no app query is provided', async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('Sign in again to resume an existing application or start a new one')
    })

    it('should render the signed-out view with registration content when app query is registration', async () => {
      const response = await submitGetRequest({ url: `${url}?app=${constants.applicationTypes.REGISTRATION.toLowerCase()}` })
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('Your registrations')
      expect(response.payload).toContain('Sign in to continue with a registration')
    })

    it('should render the signed-out view with allocation content when app query is allocation', async () => {
      const response = await submitGetRequest({ url: `${url}?app=${constants.applicationTypes.ALLOCATION.toLowerCase()}` })
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('Development projects')
      expect(response.payload).toContain('Sign in to continue with a development project')
    })

    it('should render the signed-out view with credits purchase content when app query is credits purchase', async () => {
      const response = await submitGetRequest({ url: `${url}?app=${constants.applicationTypes.CREDITS_PURCHASE.toLowerCase()}` })
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('Your statutory biodiversity credits')
      expect(response.payload).toContain('Sign in to continue with a statutory biodiversity credits purchase')
    })

    it('should render the signed-out view with combined case content when app query is combined case', async () => {
      const response = await submitGetRequest({ url: `${url}?app=${constants.applicationTypes.COMBINED_CASE.toLowerCase()}` })
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('Sign in to continue with site registration and record off-site gains for a development')
    })
  })
})
