import auth from '../../utils/auth.js'

export default [{
  method: 'GET',
  path: '/signin/callback',
  options: {
    auth: {
      mode: 'try'
    },
    handler: async (request, h) => {
      const token = await auth.authenticate(request.query.code, request.cookieAuth)
      request.cookieAuth.set({
        account: token.account
      })
      return h.redirect('/')
    }
  }
}]
