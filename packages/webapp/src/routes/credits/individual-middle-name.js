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
    const middleName = request.yar.get(constants.redisKeys.CREDITS_INDIVIDUAL_MIDDLE_NAME)
    const middleNameOption = middleName && 'yes'
    return h.view(constants.views.CREDITS_INDIVIDUAL_MIDDLE_NAME, { 
      middleName, 
      middleNameOption 
    })
  }
}, {
  method: 'POST',
  path: constants.routes.CREDITS_INDIVIDUAL_MIDDLE_NAME,
  handler: (request, h) => {
    const { middleName, middleNameOption} = request.payload
    // no copydeck so not sure what edge case and errors are for post route..., moving ticket to blocked.
  }
}]