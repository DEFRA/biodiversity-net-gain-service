import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { getNationalityTextandValues } from '../../utils/get-nationalities.js'

const handlers = {
  get: (request, h) => {
    const allNationalities = getNationalityTextandValues()
    allNationalities.unshift({
      value: '',
      text: 'Choose nationality',
      selected: true
    })

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_NATIONALITY, {
      allNationalities
    })
  },
  post: (request, h) => {
    return h.redirect('/')
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
