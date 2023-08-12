import constants from '../../credits/constants.js'
import calculateCost from '../../credits/calculate.js'
import Joi from 'joi'

const errorMessage = { text: 'Enter the credit unit from the metric. The credit unit must be entered up to 2 decimal places, like 23.75.' }
const inputSchema = Joi.string().regex(/^[0-9]*(\.\d{1,2})?$/).allow('')

export default [
  {
    method: 'GET',
    path: constants.routes.ESTIMATOR_CREDITS_TIER,
    options: {
      auth: false
    },
    handler: (request, h) => {
      const previousCostCalculation = request.yar.get(constants.redisKeys.ESTIMATOR_CREDITS_CALCULATION)
      const inputValues = (previousCostCalculation)
        ? Object.fromEntries(previousCostCalculation.tierCosts.map(({ tier, unitAmount, _ }) => [tier, unitAmount]))
        : {}
      return h.view(constants.views.ESTIMATOR_CREDITS_TIER, { inputValues })
    }
  },
  {
    method: 'POST',
    path: constants.routes.ESTIMATOR_CREDITS_TIER,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          a1: inputSchema,
          a2: inputSchema,
          a3: inputSchema,
          a4: inputSchema,
          a5: inputSchema,
          h: inputSchema,
          w: inputSchema
        }),
        failAction (request, h, err) {
          const errorMessages = {}
          const errorList = []

          err.details.forEach(e => {
            errorMessages[e.context.key] = errorMessage
            errorList.push({
              ...errorMessage,
              href: `#${e.context.key}-units`
            })
          })

          return h.view(constants.views.ESTIMATOR_CREDITS_TIER, {
            inputValues: { ...request.payload },
            errorMessages,
            err: errorList
          }).takeover()
        }
      }
    },
    handler: (request, h) => {
      const tierUnitAmounts = Object.entries(request.payload).map(([k, v]) =>
        ({ tier: k, unitAmount: Number(v) || 0 })
      )

      request.yar.set(constants.redisKeys.ESTIMATOR_CREDITS_CALCULATION, calculateCost(tierUnitAmounts))
      return h.redirect(constants.routes.ESTIMATOR_CREDITS_COST)
    }
  }
]
