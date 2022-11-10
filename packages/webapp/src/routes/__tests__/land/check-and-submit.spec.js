import Session from '../helpers/session.js'
import checkAndSubmit from '../../../routes/land/check-and-submit.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CHECK_AND_SUBMIT
jest.mock('../../../utils/http.js')

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, done => {
      jest.isolateModules(async () => {
        try {
          const applicationMock = JSON.parse('{"fullname":"John Smith","role":"Other","role-other":"test role","management-plan-checked":"yes","management-plan-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/management-plan/legal-agreement.doc","management-plan-file-size":"0.01","management-plan-file-type":"application/msword","legal-agreement-type":"Planning obligation (section 106 agreement)","legal-agreement-file-size":"0.01","legal-agreement-file-type":"application/msword","legal-agreement-checked":"yes","legal-agreement-file-option":"yes","legal_agreement_parties_key":"/land/legal-agreement-type","legal-agreement-parties":{"organisationError":[],"roleError":[],"organisations":[{"index":0,"value":"test1"},{"index":1,"value":"test3"}],"roles":[{"value":"County Council","organisationIndex":0,"rowIndex":0,"county_council":true},{"value":"Responsible body","organisationIndex":1,"rowIndex":3,"responsible_body":true}],"selectionCount":2},"legal-agreement-start-date":"2022-12-12T00:00:00.000Z","gain-site-reference":"BGS-24102022122306","legal-agreement-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/legal-agreement/legal-agreement.doc","land-boundary-checked":"yes","land-boundary-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-boundary/legal-agreement.doc","land-boundary-file-size":"0.01","land-boundary-file-type":"application/msword","land-boundary-grid-reference":"SE170441","land-boundary-hectares":2,"land-ownership-checked":"yes","land-ownership-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-ownership/legal-agreement.doc","land-ownership-file-size":"0.01","landowners":["Jane Smith","Tim Smith"],"landowner-consent":"true","metric-file-checked":"yes","metric-file-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/metric-upload/metric-file.xlsx","metric-file-size":"4.38","metric-file-type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","habitat-works-start-date":"2020-10-01T00:00:00.000Z","management-monitoring-start-date":"2020-10-02T00:00:00.000Z"}')
          const getHandler = checkAndSubmit[0].handler

          const session = new Session()
          Object.keys(applicationMock).forEach((item) => {
            session.set(item, applicationMock[item])
          })
          session.id = 'test'
          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await getHandler({ yar: session }, h)
          expect(viewArgs[0]).toEqual(constants.views.CHECK_AND_SUBMIT)
          // Refactoring: could produce a Joi schema to validate returned data
          expect(viewArgs[1].application).not.toBeUndefined()
          expect(typeof viewArgs[1].boolToYesNo).toEqual('function')
          expect(viewArgs[1].changeLandownersHref).toEqual(constants.routes.ADD_LANDOWNERS)
          expect(typeof viewArgs[1].dateToString).toEqual('function')
          expect(typeof viewArgs[1].hideClass).toEqual('function')
          expect(viewArgs[1].hideConsent).toEqual(false)
          expect(typeof viewArgs[1].listArray).toEqual('function')
          expect(viewArgs[1].routes).not.toBeUndefined()
          expect(redirectArgs).toEqual('')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })

  describe('POST', () => {
    it('Should process a valid application correctly', done => {
      jest.isolateModules(async () => {
        try {
          const applicationMock = JSON.parse('{"fullname":"John Smith","role":"Landowner","role-other":"","management-plan-checked":"yes","management-plan-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/management-plan/legal-agreement.doc","management-plan-file-size":"0.01","management-plan-file-type":"application/msword","legal-agreement-type":"Planning obligation (section 106 agreement)","legal-agreement-file-size":"0.01","legal-agreement-file-type":"application/msword","legal-agreement-checked":"yes","legal-agreement-file-option":"yes","legal_agreement_parties_key":"/land/legal-agreement-type","legal-agreement-parties":{"organisationError":[],"roleError":[],"organisations":[{"index":0,"value":"test1"},{"index":1,"value":"test3"}],"roles":[{"value":"County Council","organisationIndex":0,"rowIndex":0,"county_council":true},{"otherPartyName":"Responsible body","organisationIndex":1,"rowIndex":3,"responsible_body":true}],"selectionCount":2},"legal-agreement-start-date":"2022-12-12T00:00:00.000Z","gain-site-reference":"BGS-24102022122306","legal-agreement-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/legal-agreement/legal-agreement.doc","land-boundary-checked":"yes","land-boundary-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-boundary/legal-agreement.doc","land-boundary-file-size":"0.01","land-boundary-file-type":"application/msword","land-boundary-grid-reference":"SE170441","land-boundary-hectares":2,"land-ownership-checked":"yes","land-ownership-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-ownership/legal-agreement.doc","land-ownership-file-size":"0.01","landowners":["Jane Smith","Tim Smith"],"landowner-consent":"true","metric-file-checked":"yes","metric-file-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/metric-upload/metric-file.xlsx","metric-file-size":"4.38","metric-file-type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","habitat-works-start-date":"2020-10-01T00:00:00.000Z","management-monitoring-start-date":"2020-10-02T00:00:00.000Z"}')
          const postHandler = checkAndSubmit[1].handler

          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            return {
              gainSiteReference: 'test-reference'
            }
          })

          const session = new Session()
          Object.keys(applicationMock).forEach((item) => {
            session.set(item, applicationMock[item])
          })
          session.id = 'test'
          let viewArgs = ''
          let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ yar: session }, h)
          expect(viewArgs).toEqual('')
          expect(redirectArgs).toEqual([constants.routes.REGISTRATION_SUBMITTED])
          done()
        } catch (err) {
          done(err)
        }
      })
    })
    it('Should fail if backend errors', done => {
      jest.isolateModules(async () => {
        try {
          const applicationMock = JSON.parse('{"fullname":"John Smith","role":"Ecologist","role-other":"","management-plan-checked":"yes","management-plan-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/management-plan/legal-agreement.doc","management-plan-file-size":"0.01","management-plan-file-type":"application/msword","legal-agreement-type":"Planning obligation (section 106 agreement)","legal-agreement-file-size":"0.01","legal-agreement-file-type":"application/msword","legal-agreement-checked":"yes","legal-agreement-file-option":"yes","legal_agreement_parties_key":"/land/legal-agreement-type","legal-agreement-parties":{"organisationError":[],"roleError":[],"organisations":[{"index":0,"value":"test1"},{"index":1,"value":"test3"}],"roles":[{"value":"County Council","organisationIndex":0,"rowIndex":0,"county_council":true},{"value":"Responsible body","organisationIndex":1,"rowIndex":3,"responsible_body":true}],"selectionCount":2},"legal-agreement-start-date":"2022-12-12T00:00:00.000Z","gain-site-reference":"BGS-24102022122306","legal-agreement-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/legal-agreement/legal-agreement.doc","land-boundary-checked":"yes","land-boundary-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-boundary/legal-agreement.doc","land-boundary-file-size":"0.01","land-boundary-file-type":"application/msword","land-boundary-grid-reference":"SE170441","land-boundary-hectares":2,"land-ownership-checked":"yes","land-ownership-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-ownership/legal-agreement.doc","land-ownership-file-size":"0.01","landowners":["Jane Smith","Tim Smith"],"landowner-consent":"true","metric-file-checked":"yes","metric-file-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/metric-upload/metric-file.xlsx","metric-file-size":"4.38","metric-file-type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","habitat-works-start-date":"2020-10-01T00:00:00.000Z","management-monitoring-start-date":"2020-10-02T00:00:00.000Z"}')
          const postHandler = checkAndSubmit[1].handler

          const http = require('../../../utils/http.js')
          http.postJson = jest.fn().mockImplementation(() => {
            throw new Error('test error')
          })

          const session = new Session()
          Object.keys(applicationMock).forEach((item) => {
            session.set(item, applicationMock[item])
          })
          session.id = 'test'

          let viewArgs = ''; let redirectArgs = ''
          const h = {
            view: (...args) => {
              viewArgs = args
            },
            redirect: (...args) => {
              redirectArgs = args
            }
          }

          await postHandler({ yar: session }, h)
          expect(viewArgs[0]).toEqual(constants.views.CHECK_AND_SUBMIT)
          expect(viewArgs[1].err[0].text).toEqual('There is a problem')
          expect(redirectArgs).toEqual('')
          done()
        } catch (err) {
          done(err)
        }
      })
    })
  })
})
