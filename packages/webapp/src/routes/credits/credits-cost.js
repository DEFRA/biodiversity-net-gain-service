import constants from '../../credits/constants.js'

const getLocaleString = num =>
  num.toLocaleString('en-gb', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 })

const getRow = ({ tier, unitAmount, cost }) => [
  { text: tier.toUpperCase() },
  { text: unitAmount, format: 'numeric' },
  { text: getLocaleString(cost), format: 'numeric' }
]

export default [
  {
    method: 'GET',
    path: constants.routes.CREDITS_COST,
    options: {
      auth: false
    },
    handler: (request, h) => {
      const creditCosts = request.yar.get(constants.redisKeys.CREDITS_CALCULATION)

      if (!creditCosts) {
        return h.redirect(constants.routes.CREDITS_TIER)
      }

      const totalCost = getLocaleString(creditCosts.total)

      return h.view(constants.views.CREDITS_COST, {
        totalCost,
        backLink: constants.routes.CREDITS_TIER,
        tierRows: [
          ...creditCosts.tierCosts.map(item => getRow(item)),
          [{ text: 'Total estimated cost' }, { text: '' }, { text: totalCost, format: 'numeric' }]
        ]
      })
    }
  }
]
