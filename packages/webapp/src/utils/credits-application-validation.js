import Joi from 'joi'

const creditsApplicationValidation = Joi.object({
  creditsPurchase: Joi.object({
    applicant: Joi.object({
      contactId: Joi.string().required()
    }),
    creditReference: Joi.string().allow(''),
    submittedOn: Joi.date().required()
  })
})

export default creditsApplicationValidation
