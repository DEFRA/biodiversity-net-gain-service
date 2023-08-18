import constants from '../../credits/constants.js'
import calculateCost from '../../credits/calculate.js'
import Joi from 'joi'

const defaultErrorMessage = { text: 'Enter the credit unit from the metric. The credit unit must be entered up to 2 decimal places, like 23.75.' }
const customErrorMessage = { text: 'Enter at least one credit unit from the metric.' }
const inputSchema = Joi.string().regex(/^[0-9]*(\.\d{1,2})?$/).allow('')

export default [
  {
    method: 'GET',
    path: constants.routes.CREDITS_TIER,
    handler: (request, h) => {
      const previousCostCalculation = request.yar.get(constants.redisKeys.CREDITS_CALCULATION)
      const inputValues = (previousCostCalculation)
        ? Object.fromEntries(previousCostCalculation.tierCosts.map(({ tier, unitAmount, _ }) => [tier, unitAmount]))
        : {}
      return h.view(constants.views.CREDITS_TIER, { inputValues })
    }
  },
  {
    method: 'POST',
    path: constants.routes.CREDITS_TIER,
    options: {
      validate: {
        payload: Joi.object({
          a1: inputSchema,
          a2: inputSchema,
          a3: inputSchema,
          a4: inputSchema,
          a5: inputSchema,
          h: inputSchema,
          w: inputSchema
        }).custom((value, helpers) => {
          if (Object.values(value).every(v => v === '' || v === '0')) {
            throw new Error('at least one credit unit input should have a value')
          }
        }),
        failAction (request, h, err) {
          const errorMessages = {}
          const errorList = []

          if (err.details.some(e => e.type === 'any.custom')) {
            errorList.push({ ...customErrorMessage })
          } else {
            err.details.forEach(e => {
              errorMessages[e.context.key] = defaultErrorMessage
              errorList.push({
                ...defaultErrorMessage,
                href: `#${e.context.key}-units`
              })
            })
          }

          return h.view(constants.views.CREDITS_TIER, {
            errorMessages,
            inputValues: { ...request.payload },
            err: errorList
          }).takeover()
        }
      }
    },
    handler: (request, h) => {
      request.yar.set(constants.redisKeys.CREDITS_CALCULATION, calculateCost(request.payload))
      return h.redirect(constants.routes.CREDITS_COST)
    }
  }
]
