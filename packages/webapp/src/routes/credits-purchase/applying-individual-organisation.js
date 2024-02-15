import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.APPLYING_INDIVIDIAL_ORGANISATION,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(creditsPurchaseConstants.views.APPLYING_INDIVIDIAL_ORGANISATION)
  }
]
