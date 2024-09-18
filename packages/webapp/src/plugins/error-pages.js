import getApplicantContext from '../utils/get-applicant-context.js'

const errorPages = {
  name: 'error-pages',
  register: server => {
    server.ext('onPreResponse', async (request, h) => {
      const response = request.response

      if (response.isBoom) {
        const statusCode = response.output.statusCode

        // Log the error
        request.log('error', {
          statusCode,
          message: response.message,
          stack: response.data ? response.data.stack : response.stack
        })

        const context = {
          auth: {
            firstName: '',
            lastName: ''
          }
        }

        // Handle 404 errors
        if (statusCode === 404) {
          return h.view('404', context).code(statusCode)
        }

        // Add additional context if authenticated
        if (request.auth?.credentials) {
          const { representing, organisation } = getApplicantContext(request.auth.credentials.account, request.yar)
          const accountInfo = request.auth.credentials.account.idTokenClaims

          context.auth = {
            firstName: accountInfo.firstName,
            lastName: accountInfo.lastName,
            ...(organisation && { representing })
          }
        }

        // Handle 500 errors
        const referer = request.headers.referer
        if (statusCode === 500 && referer && referer.endsWith('/check-and-submit')) {
          const errorContext = {
            ...context,
            metricValidationError: 'Your application could not be submitted.  This could be because of an error in a metric file that you uploaded.  Please check your metric file(s) for any data errors'
          }
          return h.view('500', errorContext).code(statusCode)
        }

        // Return the generic 500 view
        return h.view('500', context).code(statusCode)
      }

      return h.continue
    })
  }
}

export default errorPages
