import constants from '../../utils/constants.js'
import { getNationalityTextandValues } from '../../utils/get-nationalities.js'

export default [{
  method: 'GET',
  path: constants.routes.PURCHASE_CREDITS_INDIVIDUAL_NATIONALITY,
  handler: (_request, h) => {
    const allNationalities = getNationalityTextandValues()
    allNationalities.unshift({
      value: '',
      text: 'Choose nationality',
      selected: true
    })

    return h.view(constants.views.PURCHASE_CREDITS_INDIVIDUAL_NATIONALITY, {
      allNationalities
    })
  }
}]
