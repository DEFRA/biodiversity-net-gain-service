import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'

const handlers = {
  get: (request, h) => {
    const values = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME) || {}
    const errors = request.yar.get('errors') || null

    request.yar.clear('errors')

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_MIDDLE_NAME, {
      ...values,
      err: errors
    })
  },
  post: (request, h) => {
    const { middleName, middleNameOption } = request.payload
    const errors = []

    if (!middleNameOption) {
      errors.push({
        text: 'Select yes if you have a middle name',
        href: '#middle-name-yes'
      })
    } else if (middleNameOption === 'yes' && (middleName.length === 0 || middleName.length > 50)) {
      const errorText = middleName.length === 0 ? 'Enter your middle name' : 'Middle name must be 50 characters or fewer'
      errors.push({
        text: errorText,
        href: '#middle-name'
      })
    }

    if (errors.length > 0) {
      request.yar.set('errors', errors)
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME, { middleName, middleNameOption })
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME)
    }

    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_MIDDLE_NAME, {
      middleNameOption,
      middleName: middleNameOption === 'no' ? '' : middleName
    })

    const referrerUrl = getValidReferrerUrl(request.yar, creditsPurchaseConstants.CREDITS_PURCHASE_CDD_VALID_REFERRERS)
    return h.redirect(referrerUrl || creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH)
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
