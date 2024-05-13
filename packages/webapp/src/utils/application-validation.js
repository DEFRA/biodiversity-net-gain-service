import Joi from 'joi'
import constants from './constants.js'

const applicantAddressSchema = Joi.object({
  type: Joi.string().valid('uk', 'international').required(),
  line1: Joi.string().required(),
  line2: Joi.string(),
  line3: Joi.string(),
  town: Joi.string().required(),
  postcode: Joi.when('type', {
    is: 'uk',
    then: Joi.string().required(),
    otherwise: Joi.string()
  }),
  county: Joi.string(),
  country: Joi.when('type', {
    is: 'international',
    then: Joi.string().required(),
    otherwise: Joi.string()
  })
}).required()

const responsibleBodySchema = Joi.object({
  responsibleBodyName: Joi.string().required()
}).required()

const legalAgreementPlanningAuthoritySchema = Joi.object({
  LPAName: Joi.string().required(),
  LPAId: Joi.string().allow('').required()
}).required()

const applicationValidation = Joi.object({
  landownerGainSiteRegistration: Joi.object({
    applicant: Joi.object({
      id: Joi.string().required(),
      role: Joi.string().valid('agent', 'landowner', 'representative').required()
    }),
    agent: Joi.when('applicant.role', {
      is: 'agent',
      then: Joi.object({
        clientType: Joi.string().valid('organisation', 'individual').required(),
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
        clientPhoneNumber: Joi.when('clientType', {
          is: 'individual',
          then: Joi.string().required(),
          otherwise: Joi.forbidden()
        }),
        clientEmail: Joi.when('clientType', {
          is: 'individual',
          then: Joi.string().required(),
          otherwise: Joi.forbidden()
        }),
        clientAddress: applicantAddressSchema
      }),
      otherwise: Joi.forbidden()
    }),
    landownerAddress: Joi.when('applicant.role', {
      is: 'landowner',
      then: applicantAddressSchema,
      otherwise: Joi.forbidden()
    }),
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
          proposedHabitatId: Joi.string(),
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
    files: Joi.array().items(
      Joi.object({
        fileType: Joi.string().valid('legal-agreement', 'local-land-charge', 'habitat-plan', 'land-boundary', 'metric', 'land-ownership', 'geojson', 'written-authorisation').required(),
        contentMediaType: Joi.when('optional', {
          is: true,
          then: Joi.string().allow(null),
          otherwise: Joi.string().required()
        }),
        fileSize: Joi.when('optional', {
          is: true,
          then: Joi.number().allow(null),
          otherwise: Joi.number().required()
        }),
        fileLocation: Joi.when('optional', {
          is: true,
          then: Joi.string().allow(null),
          otherwise: Joi.string().required()
        }),
        fileName: Joi.when('optional', {
          is: true,
          then: Joi.string().allow(null),
          otherwise: Joi.string().required()
        }),
        optional: Joi.boolean().required()
      })
    ).required(),
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
    landowners: Joi.object({
      organisation: Joi.array().items(
        Joi.object({
          organisationName: Joi.string().required()
        })
      ),
      individual: Joi.array().items(
        Joi.object({
          firstName: Joi.string().required(),
          middleNames: Joi.string().allow('').optional(),
          lastName: Joi.string().required(),
          email: Joi.string().required()
        })
      )
    }).required(),
    enhancementWorkStartDate: Joi.date().allow(null),
    legalAgreementEndDate: Joi.date().allow(null),
    submittedOn: Joi.date().required(),
    payment: Joi.object({
      reference: Joi.string().allow(null, ''),
      method: Joi.string().required(),
      type: Joi.string().required().optional(),
      govPayReference: Joi.string().allow('', null).optional(),
      paymentDate: Joi.string().allow('', null).optional(),
      paymentStatus: Joi.string().allow('', null).optional(),
      amount: Joi.number().optional()
    })
  })
})

export default applicationValidation
