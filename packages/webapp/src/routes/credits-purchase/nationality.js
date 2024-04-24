import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { getNationalityTextAndValues } from '../../utils/get-nationalities.js'

const errorText = 'Start typing and enter a country from the list'

const getNationalitySelects = (enteredNationalities) => {
  const nationalitySelects = [
    getNationalityTextAndValues(),
    getNationalityTextAndValues(),
    getNationalityTextAndValues(),
    getNationalityTextAndValues()
  ]

  if (enteredNationalities) {
    Object.entries(enteredNationalities).forEach(([key, value]) => {
      if (value !== '') {
        const nationalityList = nationalitySelects[Number(key.slice(-1)) - 1]
        const index = nationalityList.findIndex(nationality => nationality.value === value)
        delete nationalityList[0].selected
        nationalityList[index].selected = true
      }
    })
  }

  return nationalitySelects
}

const handlers = {
  get: (request, h) => {
    const enteredNationalities = request.yar.get(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_NATIONALITY)

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_NATIONALITY, {
      nationalitySelects: getNationalitySelects(enteredNationalities),
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH
    })
  },
  post: (request, h) => {
    const nationalities = request.payload

    if (Object.values(nationalities).some(nationality => nationality !== '')) {
      request.yar.set(creditsPurchaseConstants.cacheKeys.CREDITS_PURCHASE_NATIONALITY, nationalities)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE)
    } else {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_NATIONALITY, {
        nationalitySelects: getNationalitySelects(),
        backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH,
        err: [{
          text: errorText,
          href: '#nationality1'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY,
  handler: handlers.post
}]
