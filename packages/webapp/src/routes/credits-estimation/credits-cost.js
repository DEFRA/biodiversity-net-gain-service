import constants from '../../credits/constants.js'

const toLocaleString = num =>
  num.toLocaleString('en-gb', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 })

const getRow = ({ tier, unitAmount, cost }) => [
  { text: tier.toUpperCase() },
  { text: unitAmount, format: 'numeric' },
  { text: toLocaleString(cost), format: 'numeric' }
]

export default [
  {
    method: 'GET',
    path: constants.routes.ESTIMATOR_CREDITS_COST,
    options: {
      auth: false
    },
    handler: (request, h) => {
      const creditCosts = request.yar.get(constants.redisKeys.ESTIMATOR_CREDITS_CALCULATION)

      if (!creditCosts) {
        return h.redirect(constants.routes.ESTIMATOR_CREDITS_TIER)
      }

      const totalCost = toLocaleString(creditCosts.total)

      return h.view(constants.views.ESTIMATOR_CREDITS_COST, {
        backLink: constants.routes.ESTIMATOR_CREDITS_TIER,
        totalCost,
        tierRows: [
          ...creditCosts.tierCosts.map(item => getRow(item)),
          [{ text: 'Total estimated cost' }, { text: '' }, { text: totalCost, format: 'numeric' }]
        ]
      })
    }
  }
]
