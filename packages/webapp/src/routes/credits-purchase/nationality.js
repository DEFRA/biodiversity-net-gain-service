import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { getNationalityTextAndValues } from '../../utils/get-nationalities.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'

const errorText = 'Select a nationality from the dropdown list'
const duplicateNationalitiesErrorText = 'Remove duplicate nationality'

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
    const enteredNationalities = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY)

    const errors = request.yar.get('errors') || null
    request.yar.clear('errors')

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_NATIONALITY, {
      nationalitySelects: getNationalitySelects(enteredNationalities),
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_DATE_OF_BIRTH,
      err: errors
    })
  },
  post: (request, h) => {
    const nationalities = request.payload
    const nonEmptyNationalities = Object.values(nationalities).filter(n => n !== '')
    const hasAtLeastOneNationality = nonEmptyNationalities.length > 0
    const errors = []

    // If no nationality is selected, return early with error
    if (!hasAtLeastOneNationality) {
      errors.push({
        text: errorText,
        href: '#nationality1'
      })
      request.yar.set('errors', errors)
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY, nationalities)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY)
    }

    const isUnique = nonEmptyNationalities.length === new Set(nonEmptyNationalities).size

    // If nationalities are unique, store and redirect
    if (isUnique) {
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY, nationalities)
      const referrerUrl = getValidReferrerUrl(request.yar, creditsPurchaseConstants.CREDITS_PURCHASE_CDD_VALID_REFERRERS)
      return h.redirect(referrerUrl || creditsPurchaseConstants.routes.CREDITS_PURCHASE_CUSTOMER_DUE_DILIGENCE)
    }

    // Generate errors for duplicate nationalities
    Object.values(nationalities).forEach((nationality, indexOfFirstOccurance) => {
      if (Object.values(nationalities).indexOf(nationality) !== indexOfFirstOccurance && nationality !== '') {
        errors.push({
          text: duplicateNationalitiesErrorText,
          href: `#nationality${indexOfFirstOccurance + 1}`
        })
      }
    })

    if (errors.length > 0) {
      request.yar.set('errors', errors)
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_NATIONALITY, nationalities)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_NATIONALITY)
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
