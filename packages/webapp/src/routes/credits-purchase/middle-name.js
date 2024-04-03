import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const handlers = {
  get: (request, h) => {
    const values = request.yar.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_MIDDLE_NAME)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_MIDDLE_NAME, values)
  },
  post: (request, h) => {
    const { middleName, middleNameOption } = request.payload
    if (!middleNameOption) {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_MIDDLE_NAME, {
        middleName,
        middleNameOption,
        err: [{
          text: 'Select yes if you have a middle name',
          href: '#middle-name-yes'
        }]
      })
    }

    if (middleNameOption === 'yes' && (middleName.length === 0 || middleName.length > 50)) {
      const errorText = middleName.length === 0 ? 'Enter your middle name' : 'Middle name must be 50 characters or fewer'
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_MIDDLE_NAME, {
        middleName,
        middleNameOption,
        err: [{
          text: errorText,
          href: '#middle-name'
        }]
      })
    }
    request.yar.set(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_MIDDLE_NAME, {
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
