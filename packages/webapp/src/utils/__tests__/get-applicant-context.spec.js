import constants from '../constants.js'
import getApplicantContext from '../get-applicant-context.js'
import Session from '../../__mocks__/session.js'
describe('get-applicant-context', () => {
  let account
  beforeEach(() => {
    account = {
      idTokenClaims: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@test.com',
        contactId: 'mock contact id'
      }
    }
  })
  it('should return correct details when the applicant is an agent', done => {
    jest.isolateModules(async () => {
      try {
        const session = new Session()
        const applicantContext = getApplicantContext(account, session)
        expect(applicantContext).toStrictEqual({
          confirmationText: 'My Defra account details are up to date and I will be applying as John Smith',
          representing: 'Myself (John Smith)',
          subject: 'John Smith'
        })
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('should return correct details when the applicant is a landowner representing themselves', done => {
    jest.isolateModules(async () => {
      try {
        const session = new Session()
        session.set(constants.redisKeys.LANDOWNER_TYPE, constants.landownerTypes.INDIVIDUAL)
        const applicantContext = getApplicantContext(account, session)
        expect(applicantContext).toStrictEqual({
          applicationSpecificGuidance: 'must be named as a landowner or leaseholder on the legal agreement to apply.',
          confirmationText: 'My Defra account details are up to date and I will be applying as John Smith',
          representing: 'Myself (John Smith)',
          subject: 'John Smith'
        })
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('should return correct details when the applicant is a landowner representing an organisation', done => {
    jest.isolateModules(async () => {
      try {
        Object.assign(account.idTokenClaims, {
          currentRelationshipId: 'mock relationship id',
          relationships: ['mock relationship id:mock organisation:0:Employee:0'],
          roles: ['mock relationship id:Standard User:2']
        })
        const session = new Session()
        session.set(constants.redisKeys.LANDOWNER_TYPE, constants.landownerTypes.ORGANISATION)
        const applicantContext = getApplicantContext(account, session)
        expect(applicantContext).toStrictEqual({
          applicationSpecificGuidance: ', the landowner or leaseholder you represent must be named on the legal agreement to apply.',
          confirmationText: 'My Defra account details are up to date and I will be applying as John Smith for mock organisation',
          organisation: 'mock organisation',
          representing: 'mock organisation',
          subject: 'mock organisation'
        })
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})