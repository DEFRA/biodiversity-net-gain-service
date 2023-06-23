import auth from '../utils/auth.js'

export default [{
  method: 'GET',
  path: '/signin',
  options: {
    auth: {
      mode: 'try'
    },
    handler: async (request, h) => {
      // If we are authenticated then return to page requested
      if (request.auth.isAuthenticated) {
        return h.redirect(request.query.next)
      }

      // Redirect to authUrl
      const authUrl = await auth.getAuthenticationUrl(request)
      return h.redirect(authUrl)
    }
  }
}]