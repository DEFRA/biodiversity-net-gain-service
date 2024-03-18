import creditsPurchaseConstants from './credits-purchase-constants.js'

export default (session, account) => {
  return {
    creditsPurchase: {
      applicant: {
        contactId: account.idTokenClaims.contactId
      },
      creditReference: session.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE) || '',
      submittedOn: new Date().toISOString()
    }
  }
}
