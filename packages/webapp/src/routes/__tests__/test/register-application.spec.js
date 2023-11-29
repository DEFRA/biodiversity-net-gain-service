import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
import testApplication from '../../../__mock-data__/test-application.js'
import application from '../../../utils/application.js'
const url = constants.routes.TEST_REGISTER_APPLICATION

describe(url, () => {
  describe('GET', () => {
    it('Should return application JSON on get', async () => {
      const sessionData = JSON.parse(testApplication.dataString)
      const response = await submitGetRequest({ url }, 200, sessionData)
      console.log(response)
    })
    it('Should return error if application validation fails', async () => {
      const sessionData = JSON.parse(testApplication.dataString)
      delete sessionData[constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO]
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.payload).toEqual('{"statusCode":500,"err":true,"message":"\\\"landownerGainSiteRegistration.habitatPlanIncludedLegalAgreementYesNo\\\" must be one of [Yes, No]"}')
    })
  })
})
