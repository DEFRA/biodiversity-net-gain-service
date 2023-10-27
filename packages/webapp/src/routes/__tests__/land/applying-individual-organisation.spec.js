import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION

describe(url, () => {
  const redisMap = new Map()
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view without any selection`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view with individual selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.REGISTRATION_APPLICANT_TYPE, constants.applicantTypes.INDIVIDUAL)
        let viewResult, contextResult
        const applicationByIndividualOrOganisation = require('../../land/applying-individual-organisation.js')
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await applicationByIndividualOrOganisation.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
        expect(contextResult.applicantType).toEqual(constants.applicantTypes.INDIVIDUAL)
      })
    })

    it(`should render the ${url.substring(1)} view with organisation selected`, async () => {
      jest.isolateModules(async () => {
        redisMap.set(constants.redisKeys.REGISTRATION_APPLICANT_TYPE, constants.applicantTypes.ORGANISATION)
        let viewResult, contextResult
        const applicationByIndividualOrOganisation = require('../../land/applying-individual-organisation.js')
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await applicationByIndividualOrOganisation.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
        expect(contextResult.applicantType).toEqual(constants.applicantTypes.ORGANISATION)
      })
    })
  })
})
