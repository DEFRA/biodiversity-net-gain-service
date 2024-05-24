import Joi from 'joi'

const developerApplicationValidation = Joi.object({
  developerRegistration: Joi.object({
    applicant: Joi.object({
      id: Joi.string().required(),
      role: Joi.string().valid('agent', 'individual', 'organisation').required()
    }).required(),
    isLandownerLeaseholder: Joi.string().valid('yes', 'no').required(),
    organisation: Joi.object({
      id: Joi.string().required()
    }).optional(),
    agent: Joi.when('applicant.role', {
      is: 'agent',
      then: Joi.object({
        clientType: Joi.string().valid('individual', 'organisation').required(),
        clientNameIndividual: Joi.when('clientType', {
          is: 'individual',
          then: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required()
          }),
          otherwise: Joi.forbidden()
        }),
        clientNameOrganisation: Joi.when('clientType', {
          is: 'organisation',
          then: Joi.string().required(),
          otherwise: Joi.forbidden()
        })
      }),
      otherwise: Joi.forbidden()
    }),
    gainSite: Joi.object({
      reference: Joi.string().required(),
      offsiteUnitChange: Joi.object({
        habitat: Joi.number().required(),
        hedge: Joi.number().required(),
        watercourse: Joi.number().required()
      }).required()
    }).required(),
    habitats: Joi.object({
      allocated: Joi.array().items(Joi.object({
        habitatId: Joi.string().required(),
        area: Joi.number().required(),
        module: Joi.string().valid('Baseline', 'Created', 'Enhanced').required(),
        state: Joi.string().valid('Habitat', 'Hedge', 'Watercourse').required(),
        measurementUnits: Joi.string().valid('hectares', 'kilometres').required()
      })).required()
    }).required(),
    files: Joi.array().items(Joi.object({
      contentMediaType: Joi.string().required(),
      fileType: Joi.string().required(),
      fileSize: Joi.number().required(),
      fileLocation: Joi.string().required(),
      fileName: Joi.string().required(),
      optional: Joi.boolean().required()
    })).required(),
    development: Joi.object({
      localPlanningAuthority: Joi.object({
        code: Joi.string().pattern(/^E60000[0-9]{3}$/).allow(null, '').required(),
        name: Joi.string().max(255).required()
      }),
      planningReference: Joi.string(),
      name: Joi.string()
    }).required(),
    payment: Joi.object({
      reference: Joi.string().required(),
      method: Joi.string().valid('BACS').required()
    }).required(),
    allocationReference: Joi.string().required(),
    submittedOn: Joi.date().required()
  }).required()
})

export default developerApplicationValidation
