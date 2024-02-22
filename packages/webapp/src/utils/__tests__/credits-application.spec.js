import setCreditsApplicationSession from '../../__mocks__/credits-application-session'
import creditsApplication from '../credits-application'
import constants from '../constants.js'
import applicant from '../../__mocks__/applicant'

describe('credits-application', () => {
  it('Should set the credit application reference number has been updated', () => {
    const session = setCreditsApplicationSession()
    const gainSiteReference = 'BNGCRD-TEST1-T3ST2'
    session.set(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE, gainSiteReference)

    const app = creditsApplication(session, applicant)
    expect(app.creditsPurchase.gainSiteReference).toEqual(gainSiteReference)
  })

  it('Should handle nullable fields if session data not exists', () => {
    const session = setCreditsApplicationSession()
    session.clear(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE)

    const app = creditsApplication(session, applicant)
    expect(app.creditsPurchase.gainSiteReference).toEqual('')
  })
})
