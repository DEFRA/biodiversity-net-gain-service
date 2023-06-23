import auth from '../../utils/auth.js'

export default [{
  method: 'GET',
  path: '/signin/callback',
  options: {
    auth: {
      mode: 'try'
    },
    handler: async (request, h) => {
      await auth.authenticate(request.query.code, request.cookieAuth)
      return h.redirect('/')
    }
  }
}]
