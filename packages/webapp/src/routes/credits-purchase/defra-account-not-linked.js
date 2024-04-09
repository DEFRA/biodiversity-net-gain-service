import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default {
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_DEFRA_ACCOUNT_NOT_LINKED,
  handler: (_, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_DEFRA_ACCOUNT_NOT_LINKED, {
    backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG
  })
}
