import creditsEstimationConstants from '../../utils/credits-estimation-constants.js'

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
    path: creditsEstimationConstants.routes.ESTIMATOR_CREDITS_COST,
    options: {
      auth: false
    },
    handler: (request, h) => {
      const creditCosts = request.yar.get(creditsEstimationConstants.redisKeys.ESTIMATOR_CREDITS_CALCULATION)

      if (!creditCosts) {
        return h.redirect(creditsEstimationConstants.routes.ESTIMATOR_CREDITS_TIER)
      }

      const totalCost = getLocaleString(creditCosts.total)

      return h.view(creditsEstimationConstants.views.ESTIMATOR_CREDITS_COST, {
        totalCost,
        backLink: creditsEstimationConstants.routes.ESTIMATOR_CREDITS_TIER,
        tierRows: [
          ...creditCosts.tierCosts.map(item => getRow(item)),
          [{ text: 'Total estimated cost' }, { text: '' }, { text: totalCost, format: 'numeric' }]
        ]
      })
    }
  }
]
