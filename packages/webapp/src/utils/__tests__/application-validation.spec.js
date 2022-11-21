/*
Conditionals to test:
  - If applicant not landowner then length of otherLandowners must be > 1
  - management and monitoring start date must be greater than or equal to habitatworkstart date
  - If otherLandowners length > 0 then landownerConsent must be true
*/
import applicationValidation from '../application-validation.js'
import application from '../application.js'
import Session from '../../routes/__tests__/helpers/session.js'

describe('application-validation', () => {
  describe('validate', () => {
    it('Should pass validation for normal test', () => {
      const applicationMock = JSON.parse('{"fullname":"John Smith","role":"Other","role-other":"test role","management-plan-checked":"yes","management-plan-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/management-plan/legal-agreement.doc","management-plan-file-size":"0.01","management-plan-file-type":"application/msword","legal-agreement-type":"759150000","legal-agreement-file-size":"0.01","legal-agreement-file-type":"application/msword","legal-agreement-checked":"yes","legal-agreement-file-option":"yes","legal_agreement_parties_key":"/land/legal-agreement-type","legal-agreement-parties":{"organisationError":[],"roleError":[],"organisations":[{"index":0,"value":"test1"},{"index":1,"value":"test3"}],"roles":[{"value":"County Council","organisationIndex":0,"rowIndex":0,"county_council":true},{"other": true,"otherPartyName":"Test role","organisationIndex":1,"rowIndex":3,"responsible_body":true}],"selectionCount":2},"legal-agreement-start-date":"2022-12-12T00:00:00.000Z","gain-site-reference":"BGS-24102022122306","legal-agreement-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/legal-agreement/legal-agreement.doc","land-boundary-checked":"yes","land-boundary-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-boundary/legal-agreement.doc","land-boundary-file-size":"0.01","land-boundary-file-type":"application/msword","land-boundary-grid-reference":"SE170441","land-boundary-hectares":2,"land-ownership-checked":"yes","land-ownership-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-ownership/legal-agreement.doc","land-ownership-file-size":"0.01","landowners":["Jane Smith","Tim Smith"],"landowner-consent":"true","metric-file-checked":"yes","metric-file-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/metric-upload/metric-file.xlsx","metric-file-size":"4.38","metric-file-type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","habitat-works-start-date":"2020-10-01T00:00:00.000Z","management-monitoring-start-date":"2020-10-02T00:00:00.000Z"}')
      const session = new Session()
      Object.keys(applicationMock).forEach((item) => {
        session.set(item, applicationMock[item])
      })
      const { value, error } = applicationValidation.validate(application(session))
      expect(error).toBeUndefined()
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if not a landowner and otherLandowners is empty', () => {
      const applicationMock = JSON.parse('{"fullname":"John Smith","role":"Other","role-other":"test role","management-plan-checked":"yes","management-plan-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/management-plan/legal-agreement.doc","management-plan-file-size":"0.01","management-plan-file-type":"application/msword","legal-agreement-type":"759150000","legal-agreement-file-size":"0.01","legal-agreement-file-type":"application/msword","legal-agreement-checked":"yes","legal-agreement-file-option":"yes","legal_agreement_parties_key":"/land/legal-agreement-type","legal-agreement-parties":{"organisationError":[],"roleError":[],"organisations":[{"index":0,"value":"test1"},{"index":1,"value":"test3"}],"roles":[{"value":"County Council","organisationIndex":0,"rowIndex":0,"county_council":true},{"other": true,"otherPartyName":"Test role","organisationIndex":1,"rowIndex":3,"responsible_body":true}],"selectionCount":2},"legal-agreement-start-date":"2022-12-12T00:00:00.000Z","gain-site-reference":"BGS-24102022122306","legal-agreement-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/legal-agreement/legal-agreement.doc","land-boundary-checked":"yes","land-boundary-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-boundary/legal-agreement.doc","land-boundary-file-size":"0.01","land-boundary-file-type":"application/msword","land-boundary-grid-reference":"SE170441","land-boundary-hectares":2,"land-ownership-checked":"yes","land-ownership-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-ownership/legal-agreement.doc","land-ownership-file-size":"0.01","landowners":[],"landowner-consent":"true","metric-file-checked":"yes","metric-file-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/metric-upload/metric-file.xlsx","metric-file-size":"4.38","metric-file-type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","habitat-works-start-date":"2020-10-01T00:00:00.000Z","management-monitoring-start-date":"2020-10-02T00:00:00.000Z"}')
      const session = new Session()
      Object.keys(applicationMock).forEach((item) => {
        session.set(item, applicationMock[item])
      })
      const { value, error } = applicationValidation.validate(application(session))
      expect(error.message).toEqual('"landownerGainSiteRegistration.otherLandowners" must contain at least 1 items')
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if habitatworkstart date is after management and monitoring start date', () => {
      const applicationMock = JSON.parse('{"fullname":"John Smith","role":"Other","role-other":"test role","management-plan-checked":"yes","management-plan-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/management-plan/legal-agreement.doc","management-plan-file-size":"0.01","management-plan-file-type":"application/msword","legal-agreement-type":"759150000","legal-agreement-file-size":"0.01","legal-agreement-file-type":"application/msword","legal-agreement-checked":"yes","legal-agreement-file-option":"yes","legal_agreement_parties_key":"/land/legal-agreement-type","legal-agreement-parties":{"organisationError":[],"roleError":[],"organisations":[{"index":0,"value":"test1"},{"index":1,"value":"test3"}],"roles":[{"value":"County Council","organisationIndex":0,"rowIndex":0,"county_council":true},{"other": true,"otherPartyName":"Test role","organisationIndex":1,"rowIndex":3,"responsible_body":true}],"selectionCount":2},"legal-agreement-start-date":"2022-12-12T00:00:00.000Z","gain-site-reference":"BGS-24102022122306","legal-agreement-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/legal-agreement/legal-agreement.doc","land-boundary-checked":"yes","land-boundary-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-boundary/legal-agreement.doc","land-boundary-file-size":"0.01","land-boundary-file-type":"application/msword","land-boundary-grid-reference":"SE170441","land-boundary-hectares":2,"land-ownership-checked":"yes","land-ownership-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-ownership/legal-agreement.doc","land-ownership-file-size":"0.01","landowners":["Jane Smith","Tim Smith"],"landowner-consent":"true","metric-file-checked":"yes","metric-file-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/metric-upload/metric-file.xlsx","metric-file-size":"4.38","metric-file-type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","habitat-works-start-date":"2023-10-01T00:00:00.000Z","management-monitoring-start-date":"2020-10-02T00:00:00.000Z"}')
      const session = new Session()
      Object.keys(applicationMock).forEach((item) => {
        session.set(item, applicationMock[item])
      })
      const { value, error } = applicationValidation.validate(application(session))
      expect(error.message).toEqual('"landownerGainSiteRegistration.managementMonitoringStartDate" must be greater than or equal to "ref:habitatWorkStartDate"')
      expect(value).not.toBeUndefined()
    })
    it('Should fail validation if otherLandowners and landownerConsent is false', () => {
      const applicationMock = JSON.parse('{"fullname":"John Smith","role":"Other","role-other":"test role","management-plan-checked":"yes","management-plan-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/management-plan/legal-agreement.doc","management-plan-file-size":"0.01","management-plan-file-type":"application/msword","legal-agreement-type":"759150000","legal-agreement-file-size":"0.01","legal-agreement-file-type":"application/msword","legal-agreement-checked":"yes","legal-agreement-file-option":"yes","legal_agreement_parties_key":"/land/legal-agreement-type","legal-agreement-parties":{"organisationError":[],"roleError":[],"organisations":[{"index":0,"value":"test1"},{"index":1,"value":"test3"}],"roles":[{"value":"County Council","organisationIndex":0,"rowIndex":0,"county_council":true},{"other": true,"otherPartyName":"Test role","organisationIndex":1,"rowIndex":3,"responsible_body":true}],"selectionCount":2},"legal-agreement-start-date":"2022-12-12T00:00:00.000Z","gain-site-reference":"BGS-24102022122306","legal-agreement-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/legal-agreement/legal-agreement.doc","land-boundary-checked":"yes","land-boundary-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-boundary/legal-agreement.doc","land-boundary-file-size":"0.01","land-boundary-file-type":"application/msword","land-boundary-grid-reference":"SE170441","land-boundary-hectares":2,"land-ownership-checked":"yes","land-ownership-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/land-ownership/legal-agreement.doc","land-ownership-file-size":"0.01","landowners":["Jane Smith","Tim Smith"],"landowner-consent":"false","metric-file-checked":"yes","metric-file-location":"9bb4fac1-a0b8-4735-86c8-e63a7fe26dda/metric-upload/metric-file.xlsx","metric-file-size":"4.38","metric-file-type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","habitat-works-start-date":"2020-10-01T00:00:00.000Z","management-monitoring-start-date":"2020-10-02T00:00:00.000Z"}')
      const session = new Session()
      Object.keys(applicationMock).forEach((item) => {
        session.set(item, applicationMock[item])
      })
      const { value, error } = applicationValidation.validate(application(session))
      expect(error.message).toEqual('"landownerGainSiteRegistration.landownerConsent" must be [true]')
      expect(value).not.toBeUndefined()
    })
  })
})
