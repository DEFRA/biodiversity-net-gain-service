import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const handlers = {
  get: (request, h) => {
    const values = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_MIDDLE_NAME, values)
  },
  post: (request, h) => {
    const { middleName, middleNameOption } = request.payload
    if (!middleNameOption) {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_MIDDLE_NAME, {
        middleName,
        middleNameOption,
        err: [{
          text: 'Select yes and enter your middle name',
          href: '#middle-name-yes'
        }]
      })
    }
    if (middleNameOption === 'yes' && middleName.length === 0) {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_MIDDLE_NAME, {
        middleName,
        middleNameOption,
        err: [{
          text: 'Enter your middle name',
          href: '#middle-name'
        }]
      })
    }
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME, {
      middleNameOption,
      middleName
    })
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME,
  handler: handlers.post
}]
