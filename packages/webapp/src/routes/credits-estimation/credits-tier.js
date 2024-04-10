import creditsEstimationConstants from '../../utils/credits-estimation-constants.js'
import calculateCost from '../../credits/calculate.js'
import Joi from 'joi'
import { creditsValidationFailAction, creditsValidationSchema } from '../../utils/helpers.js'

const defaultErrorMessage = { text: 'Enter at least one credit from the metric up to 2 decimal places, like 23.75' }
const charLengthErrorMessage = { text: 'Number of credits must be 10 characters or fewer' }
const inputSchema = Joi.string().max(10).regex(/^\d*(\.\d{1,2})?$/).allow('')

const handlers = {
  get: async (request, h) => {
    const previousCostCalculation = request.yar.get(creditsEstimationConstants.redisKeys.ESTIMATOR_CREDITS_CALCULATION)
    const inputValues = (previousCostCalculation)
      ? Object.fromEntries(previousCostCalculation.tierCosts.map(({ tier, unitAmount, _ }) => [tier, unitAmount]))
      : {}
    return h.view(creditsEstimationConstants.views.ESTIMATOR_CREDITS_TIER, { inputValues })
  },
  post: async (request, h) => {
    request.yar.set(creditsEstimationConstants.redisKeys.ESTIMATOR_CREDITS_CALCULATION, calculateCost(request.payload))
    return h.redirect(creditsEstimationConstants.routes.ESTIMATOR_CREDITS_COST)
  }
}

const payloadValidationSchema = creditsValidationSchema(inputSchema)

const validationFailAction = (request, h, err) => {
  const { errorMessages, errorList } = creditsValidationFailAction({
    err,
    defaultErrorMessage,
    charLengthErrorMessage
  })

  return h.view(creditsEstimationConstants.views.ESTIMATOR_CREDITS_TIER, {
    errorMessages,
    inputValues: { ...request.payload },
    err: errorList
  }).takeover()
}

export default [
  {
    method: 'GET',
    path: creditsEstimationConstants.routes.ESTIMATOR_CREDITS_TIER,
    options: {
      auth: false
    },
    handler: handlers.get
  },
  {
    method: 'POST',
    path: creditsEstimationConstants.routes.ESTIMATOR_CREDITS_TIER,
    options: {
      auth: false,
      validate: {
        payload: payloadValidationSchema,
        failAction: validationFailAction
      }
    },
    handler: handlers.post
  }
]
