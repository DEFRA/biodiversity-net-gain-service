import constants from '../../utils/constants.js'
import { emailValidator, getErrById, validateName } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const emailAddresses = request.yar.get(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS)
    return h.view(constants.views.DEVELOPER_EMAIL_ENTRY, { getErrById, emailAddresses, ...getContext(request) })
  },
  post: async (request, h) => {
    const { emailAddresses, err } = getEmailAddressFromPayload(request)
    if (err.length > 0) {
      return h.view(constants.views.DEVELOPER_EMAIL_ENTRY, { emailAddresses, err, getErrById })
    }

    request.yar.set(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS, [...emailAddresses])
    return h.redirect(constants.routes.DEVELOPER_CHECK_ANSWERS)
  }
}

const getEmailAddressFromPayload = request => {
  const emailAddresses = []
  const err = []

  const fullNames = request.payload.fullNames
  const emails = request.payload.emails

  if (Array.isArray(emails)) {
    for (const i in emails) {
      processFieldValues(fullNames[i], emails[i], emailAddresses, err, i)
    }
  } else {
    processFieldValues(fullNames, emails, emailAddresses, err)
  }
  return { emailAddresses, err }
}

const getContext = request => ({
  emailAddresses: request.yar.get(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS)
})

const validateEmail = (emailAddresses, email, err, index) => {
  const hrefId = `#email-${index}`
  if (emailAddresses.find(item => item.email === email)) {
    err.push({
      text: 'Email address already exists',
      href: hrefId
    })
  }

  const emailErr = emailValidator(email, hrefId)
  if (emailErr) {
    err.push(emailErr.err[0])
  }
}

const processFieldValues = (fullName, email, emailAddresses, err, index = 0) => {
  const fullNameErr = validateName(fullName, `#fullName-${index}`)
  if (fullNameErr) {
    err.push(fullNameErr.err[0])
  }

  validateEmail(emailAddresses, email, err, index)
  emailAddresses.push({ fullName, email })
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_EMAIL_ENTRY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_EMAIL_ENTRY,
  handler: handlers.post
}]
