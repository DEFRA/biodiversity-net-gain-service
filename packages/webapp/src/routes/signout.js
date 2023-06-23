import auth from '../utils/auth.js'

export default [{
  method: 'GET',
  path: '/signout',
  options: {
    handler: async (request, h) => {
      request.cookieAuth.clear()
      await auth.logout(request)
      return h.redirect(auth.getLogoutUrl().href)
    }
  }
}]