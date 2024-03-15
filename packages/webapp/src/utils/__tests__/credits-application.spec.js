import setCreditsApplicationSession from '../../__mocks__/credits-application-session'
import creditsApplication from '../credits-application'
import creditsPurchaseConstants from '../credits-purchase-constants.js'
import applicant from '../../__mocks__/applicant'

describe('credits-application', () => {
  it('Should set the credit application reference number has been updated', () => {
    const session = setCreditsApplicationSession()
    const creditReference = 'BNGCRD-TEST1-T3ST2'
    session.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, creditReference)

    // console.log(session.values)

    const app = creditsApplication(session, applicant)
    expect(app.creditsPurchase.creditReference).toEqual(creditReference)
  })

  it('Should handle nullable fields if session data not exists', () => {
    const session = setCreditsApplicationSession()
    session.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE)

    const app = creditsApplication(session, applicant)
    expect(app.creditsPurchase.creditReference).toEqual(null)
  })
})
