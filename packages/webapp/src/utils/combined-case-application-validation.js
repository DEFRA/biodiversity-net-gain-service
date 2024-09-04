import Joi from 'joi'
import constants from './constants.js'
import { applicantAddressSchema } from './application-validation.js'

const responsibleBodySchema = Joi.object({
  responsibleBodyName: Joi.string().required()
}).required()

const legalAgreementPlanningAuthoritySchema = Joi.object({
  LPAName: Joi.string().required(),
  LPAId: Joi.string().allow('').required()
}).required()

const combinedCaseValidation = Joi.object({
  combinedCase: Joi.object({
    applicant: Joi.object({
      id: Joi.string().required(),
      role: Joi.string().valid('agent', 'landowner', 'representative').required()
    }),
    landownerAddress: Joi.when('applicant.role', {
      is: 'landowner',
      then: applicantAddressSchema,
      otherwise: Joi.forbidden()
    }),
    registrationDetails: Joi.object({
      landowners: Joi.object(),
      organisation: Joi.object({
        id: Joi.string().required(),
        address: applicantAddressSchema
      }).optional(),
      // BNGP-4130-relax-metric-check-and-submit-validation
      habitats: Joi.object({
        baseline: Joi.array().items(
          Joi.object({
            habitatType: Joi.string(),
            baselineReference: Joi.string(),
            module: Joi.string().valid('Baseline', 'Created', 'Enhanced'),
            state: Joi.string().valid('Habitat', 'Hedge', 'Watercourse'),
            condition: Joi.string(),
            area: Joi.object({
              beforeEnhancement: Joi.number(),
              afterEnhancement: Joi.number()
            }),
            measurementUnits: Joi.string().valid('hectares', 'kilometres')
          })
        ),
        proposed: Joi.array().items(
          Joi.object({
            habitatId: Joi.string().allow(null, ''), // TODO remove?
            proposedHabitatId: Joi.string().allow(null, ''), // TODO value not coming through
            baselineReference: Joi.when('module', {
              is: 'Enhanced',
              then: Joi.string(),
              otherwise: Joi.string().allow('')
            }),
            habitatReferenceNumber: Joi.string(),
            module: Joi.string().valid('Baseline', 'Created', 'Enhanced'),
            state: Joi.string().valid('Habitat', 'Hedge', 'Watercourse'),
            habitatType: Joi.string(),
            condition: Joi.string(),
            strategicSignificance: Joi.string(),
            advanceCreation: Joi.number().integer(),
            delayedCreation: Joi.number().integer(),
            encroachmentExtent: Joi.string(),
            encroachmentExtentBothBanks: Joi.string(),
            area: Joi.number(),
            measurementUnits: Joi.string().valid('hectares', 'kilometres')
          })
        )
      }),
      habitatPlanIncludedLegalAgreementYesNo: Joi.string().valid('Yes', 'No').required(),
      gainSiteReference: Joi.string().allow(''),
      landBoundaryGridReference: Joi.string().regex(constants.gridReferenceRegEx).required(),
      landBoundaryHectares: Joi.number().required(),
      legalAgreementType: Joi.string().valid(...constants.LEGAL_AGREEMENT_DOCUMENTS.map(item => item.id)).required(),
      conservationCovernantResponsibleBodies: Joi.array().items(responsibleBodySchema)
        .when('legalAgreementType', {
          is: Joi.string().not('759150000'), // When legalAgreementType is NOT '759150000'
          then: Joi.array().min(1), // Array must have at least one item
          otherwise: Joi.forbidden() // Otherwise, it shouldn't be present
        }),
      planningObligationLPAs: Joi.array().items(legalAgreementPlanningAuthoritySchema)
        .when('legalAgreementType', {
          is: Joi.string().valid('759150000'), // When legalAgreementType is  '759150000'
          then: Joi.array().min(1), // Array must have at least one item
          otherwise: Joi.forbidden() // Otherwise, it shouldn't be present
        }),
      enhancementWorkStartDate: Joi.date().allow(null),
      legalAgreementEndDate: Joi.date().allow(null),
      submittedOn: Joi.date().allow(null), // TODO required(),
      payment: Joi.object({
        reference: Joi.string().allow(null, ''),
        method: Joi.string().required()
      })
    }),
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
        }),
        clientAddress: Joi.object(), // TODO
        clientPhoneNumber: Joi.string(), // TODO
        clientEmail: Joi.string() // TODO
      }),
      otherwise: Joi.forbidden()
    }),
    allocationDetails: Joi.object({
      gainSite: Joi.object({
        reference: Joi.string().allow(null), // TODO .required(),
        offsiteUnitChange: Joi.object({
          habitat: Joi.number().required(),
          hedge: Joi.number().required(),
          watercourse: Joi.number().required()
        }).required()
      }).required(),
      habitats: Joi.object({
        allocated: Joi.array().items(Joi.object({
          habitatId: Joi.string().allow(''),
          area: Joi.number().required()
        })).required()
      }).required(),
      development: Joi.object({
        localPlanningAuthority: Joi.object({
          code: Joi.string().pattern(/^E60000[0-9]{3}$/).allow(null, '').required(),
          name: Joi.string().max(255).required()
        }),
        planningReference: Joi.string(),
        name: Joi.string()
      }).required()
    }).required(),
    files: Joi.array().items(Joi.object({
      contentMediaType: Joi.string().required(),
      fileType: Joi.string().required(),
      fileSize: Joi.number().required(),
      fileLocation: Joi.string().required(),
      fileName: Joi.string().required(),
      optional: Joi.boolean().optional()
    })).required(),
    payment: Joi.object({
      reference: Joi.string().required(),
      method: Joi.string().valid('BACS').required()
    }).required(),
    applicationReference: Joi.string().required(),
    submittedOn: Joi.date().required()
  })
})

export default combinedCaseValidation
