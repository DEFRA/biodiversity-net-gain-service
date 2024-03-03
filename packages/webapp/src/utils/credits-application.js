import constants from './constants.js'

const getCreditsAppReference = session => session.get(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE) || ''

// Credits Estimator's object schema must match the expected payload format for the Operator application
export default (session, account) => {
  return {
    creditsPurchase: {
      applicant: {
        contactId: account.idTokenClaims.contactId
      },
      gainSiteReference: getCreditsAppReference(session), // Need to get one after submitting application
      submittedOn: new Date().toISOString()
    }
  }
}