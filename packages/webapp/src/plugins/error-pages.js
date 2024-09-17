import getApplicantContext from '../utils/get-applicant-context.js'

const errorPages = {
  name: 'error-pages',
  register: server => {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response

      if (response.isBoom) {
        // An error was raised during
        // processing the request
        const statusCode = response.output.statusCode

        if (statusCode === 404) {
          return h.view('404').code(statusCode)
        }

        // Log the error
        request.log('error', {
          statusCode,
          message: response.message,
          stack: response.data ? response.data.stack : response.stack
        })

        // The return the `500` view
        const { representing, organisation } = getApplicantContext(request.auth.credentials.account, request.yar)
        const accountInfo = request.auth.credentials.account.idTokenClaims

        const context = {
          auth: {
            firstName: accountInfo.firstName,
            lastName: accountInfo.lastName
          }
        }

        if (organisation) {
          context.auth.representing = representing
        }

        return h.view('500', context).code(statusCode)
      }
      return h.continue
    })
  }
}

export default errorPages
