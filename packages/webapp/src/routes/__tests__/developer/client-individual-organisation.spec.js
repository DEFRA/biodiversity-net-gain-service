import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION

describe(url, () => {
  let viewResult
  let h
  let cacheMap
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

    cacheMap = new Map()
    clientIndividualOrganisation = require('../../developer/client-individual-organisation.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with no prior checked`, async () => {
      const response = await submitGetRequest({ url }, 200, {})
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-individual" name="individualOrOrganisation" type="radio" value="individual"')
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-organisation" name="individualOrOrganisation" type="radio" value="organisation">')
    })
    it(`should render the ${url.substring(1)} view with individual checked`, async () => {
      const response = await submitGetRequest({ url }, 200, {
        'developer/client-individual-organisation': 'individual'
      })
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-individual" name="individualOrOrganisation" type="radio" value="individual" checked>')
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-organisation" name="individualOrOrganisation" type="radio" value="organisation">')
    })
    it(`should render the ${url.substring(1)} view with organisation checked`, async () => {
      const response = await submitGetRequest({ url }, 200, {
        'developer/client-individual-organisation': 'organisation'
      })
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-individual" name="individualOrOrganisation" type="radio" value="individual"')
      expect(response.payload).toContain('<input class="govuk-radios__input" id="an-organisation" name="individualOrOrganisation" type="radio" value="organisation" checked>')
    })
  })

  describe('POST', () => {
    it('Should continue journey to CLIENTS_NAME if individualOrOrganisation is individual', async () => {
      cacheMap.set(constants.cacheKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION, constants.individualOrOrganisationTypes.INDIVIDUAL)
      const request = {
        yar: cacheMap,
        payload: { individualOrOrganisation: 'individual' }
      }

      await clientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.DEVELOPER_CLIENTS_NAME)
    })
    it('Should continue journey to CLIENTS_ORGANISATION_NAME if individualOrOrganisation is organisation', async () => {
      const request = {
        yar: cacheMap,
        payload: { individualOrOrganisation: 'organisation' }
      }

      await clientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.DEVELOPER_CLIENTS_ORGANISATION_NAME)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: cacheMap,
        payload: {}
      }

      await clientIndividualOrganisation.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
      expect(resultContext.err[0]).toEqual({ text: 'Select if your client is an individual or organisation', href: '#individualOrOrganisation' })
    })

    it('Should force replay of the journey when an existing individual or organisation value is changed', async () => {
      const postOptions = {
        url,
        payload: {}
      }
      postOptions.payload.individualOrOrganisation = constants.individualOrOrganisationTypes.INDIVIDUAL
      const sessionData = {}
      sessionData[constants.cacheKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION] = constants.individualOrOrganisationTypes.ORGANISATION
      sessionData[constants.cacheKeys.REFERER] = 'http://localhost:30000/mock-referer-url'
      const res = await submitPostRequest(postOptions, 302, sessionData)
      expect(res.headers.location).toEqual(constants.routes.DEVELOPER_CLIENTS_NAME)
    })
  })
})
