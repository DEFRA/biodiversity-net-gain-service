import Joi from 'joi'

const creditsApplicationValidation = Joi.object({
  creditsEstimation: Joi.object({
    applicant: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      emailAddress: Joi.string().required(),
      contactId: Joi.string().required()
    }),
    gainSiteReference: Joi.string().allow(''),
    submittedOn: Joi.date().required()
  })
})

export default creditsApplicationValidation
