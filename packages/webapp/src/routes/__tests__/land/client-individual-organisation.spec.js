import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
import testApplication from '../../../__mock-data__/test-application.js'
const url = constants.routes.CLIENT_INDIVIDUAL_ORGANISATION

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let clientIndividualOrganisation

  beforeEach(() => {
    h = {
      view: (view, context) => {
        viewResult = view
        resultContext = context
      },
      redirect: (view, context) => {
        viewResult = view
      }
    }

    redisMap = new Map()
    clientIndividualOrganisation = require('../../land/client-individual-organisation.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with no prior checked`, async () => {
      const response = await submitGetRequest({ url }, 200, {})
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-individual" name="landownerType" type="radio" value="individual"')
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-organisation" name="landownerType" type="radio" value="organisation">')
    })
    it(`should render the ${url.substring(1)} view with landowner checked`, async () => {
      // default session test object is set as individual
      const response = await submitGetRequest({ url })
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-individual" name="landownerType" type="radio" value="individual" checked>')
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-organisation" name="landownerType" type="radio" value="organisation">')
    })
    it(`should render the ${url.substring(1)} view with organisation checked`, async () => {
      const application = JSON.parse(testApplication.dataString)
      application['client-individual-organisation'] = 'organisation'
      const response = await submitGetRequest({ url }, 200, application)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-individual" name="landownerType" type="radio" value="individual"')
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-organisation" name="landownerType" type="radio" value="organisation" checked>')
    })
  })

  describe('POST', () => {
    it('Should continue journey to CLIENTS_NAME if landownerType is individual', async () => {
      redisMap.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, constants.landownerTypes.INDIVIDUAL)
      const request = {
        yar: redisMap,
        payload: { landownerType: 'individual' }
      }

      await clientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CLIENTS_NAME)
    })
    it('Should continue journey to CLIENTS_ORGANISATION_NAME if landownerType is organisation', async () => {
      const request = {
        yar: redisMap,
        payload: { landownerType: 'organisation' }
      }

      await clientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.CLIENTS_ORGANISATION_NAME)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {}
      }

      await clientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CLIENT_INDIVIDUAL_ORGANISATION)
      expect(resultContext.err[0]).toEqual({ text: 'Select if your client is an individual or organisation', href: '#landownerType' })
    })
  })
})
