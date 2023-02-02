import constants from '../../utils/constants.js'
import { postJson } from '../../utils/http.js'
import { validateEmail as validateEmailHelper } from '../../utils/helpers.js'
const functionAppUrl = process.env.AZURE_FUNCTION_APP_URL || 'http://localhost:7071/api'

const handlers = {
  get: async (_request, h) => h.view(constants.views.CONTINUE_SAVED_REGISTRATION),
  post: async (request, h) => {
    const error = {
      err: []
    }
    const {
      email,
      error: emailError
    } = validateEmail(request.payload.email)

    const {
      applicationReference,
      error: referenceError
    } = validateApplicationReference(request.payload.applicationReference)

    if (emailError || referenceError) {
      error.err.push(emailError)
      error.err.push(referenceError)
      return h.view(constants.views.CONTINUE_SAVED_REGISTRATION, {
        ...error,
        email: request.payload.email,
        applicationReference: request.payload.applicationReference
      })
    }

    // Get session for values
    const session = await postJson(`${functionAppUrl}/getapplicationsession`, {
      email,
      applicationReference
    })

    if (Object.keys(session).length === 0) {
      return h.view(constants.views.CONTINUE_SAVED_REGISTRATION, {
        email,
        applicationReference,
        err: [{
          text: 'We do not recognise your email address or reference number, try again',
          href: '#email'
        }, {
          text: '',
          href: '#applicationReference'
        }]
      })
    } else {
      // Restore session to Yar object
      request.yar.set(session)

      // Redirect to task list
      return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }
  }
}

const validateEmail = email => {
  const id = '#email'
  let error
  if (!email) {
    error = {
      text: 'Enter the email address',
      href: id
    }
  } else {
    const result = validateEmailHelper(email, id)
    if (result) {
      error = result.err[0]
    }
  }

  // if no error format the address to lower case
  if (!error) {
    email = email.toLowerCase()
  }

  return {
    email,
    error
  }
}

const validateApplicationReference = applicationReference => {
  const id = '#applicationReference'
  let error

  if (!applicationReference) {
    error = {
      text: 'Enter the reference number',
      href: id
    }
  } else if (applicationReference.replace(/\D/g, '').length !== 10) {
    error = {
      text: 'Enter a reference number in the correct format',
      href: id
    }
  }

  // If no error then remove non numeric characters from string
  if (!error) {
    applicationReference = applicationReference.replace(/\D/g, '')
    applicationReference = `REF${applicationReference}`
  }

  return {
    applicationReference,
    error
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CONTINUE_SAVED_REGISTRATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CONTINUE_SAVED_REGISTRATION,
  handler: handlers.post
}]
