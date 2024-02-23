import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const getLocaleString = num =>
  num.toLocaleString('en-gb', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 })

const getRow = ({ tier, unitAmount, cost }) => [
  { text: tier.toUpperCase() },
  { text: unitAmount, format: 'numeric' },
  { text: getLocaleString(cost), format: 'numeric' }
]

const handlers = {
  get: async (request, h) => {
    const creditCosts = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_COST_CALCULATION)

    if (!creditCosts) {
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION)
    }

    const totalCost = getLocaleString(creditCosts.total)

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CREDITS_COST, {
      totalCost,
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION,
      tierRows: [
        ...creditCosts.tierCosts.map(item => getRow(item)),
        [{ text: 'Total estimated cost' }, { text: '' }, { text: totalCost, format: 'numeric' }]
      ]
    })
  },
  post: async (request, h) => {
    return h.redirect('/')
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST,
  handler: handlers.post
}]
