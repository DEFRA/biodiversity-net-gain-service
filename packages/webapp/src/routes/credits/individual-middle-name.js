import constants from '../../utils/constants.js'

const individualMiddleName = {
  method: 'GET',
  path: constants.routes.CREDITS_INDIVIDUAL_MIDDLE_NAME,
  handler: (_request, h) => h.view(constants.views.CREDITS_INDIVIDUAL_MIDDLE_NAME)
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_INDIVIDUAL_MIDDLE_NAME,
  handler: (request, h) => {
    const values = request.yar.get(constants.redisKeys.CREDITS_INDIVIDUAL_MIDDLE_NAME)
    return h.view(constants.views.CREDITS_INDIVIDUAL_MIDDLE_NAME, values)
  }
}, {
  method: 'POST',
  path: constants.routes.CREDITS_INDIVIDUAL_MIDDLE_NAME,
  handler: (request, h) => {
    const { middleName, middleNameOption} = request.payload
    if (!middleNameOption) {
      return h.view(constants.views.CREDITS_INDIVIDUAL_MIDDLE_NAME, {
        middleName,
        middleNameOption,
        err: [{
          text: 'Select yes and enter your middle name',
          href: '#middle-name-yes'
        }]
      })
    }
    if (middleNameOption === 'yes' && middleName.length === 0) {
      return h.view(constants.views.CREDITS_INDIVIDUAL_MIDDLE_NAME, {
        middleName,
        middleNameOption,
        err: [{
          text: 'Enter your middle name',
          href: '#middle-name'
        }]
      })
    }
    request.yar.set(constants.redisKeys.CREDITS_INDIVIDUAL_MIDDLE_NAME, {
      middleNameOption,
      middleName
    })
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CREDITS_INDIVIDUAL_DOB)
  }
}]
