import { taskSections, checkYourAnswers, getTaskById, REGISTRATIONCONSTANTS } from '../task-sections.js'
import constants from '../../../utils/constants.js'
import { taskDefinition, taskSectionDefinition } from '../../utils.js'
import { applicantInfoJourneys } from '../../registration/applicant-info.js'
import { allocationInformationJourneys } from '../../allocation/allocation-information.js'

describe('Registration module', () => {
  it('should have the correct REGISTRATIONCONSTANTS', () => {
    expect(REGISTRATIONCONSTANTS).toEqual({
      APPLICANT_INFO: 'add-applicant-information',
      LAND_OWNERSHIP: 'add-land-ownership',
      SITE_BOUNDARY: 'add-land-boundary',
      HABITAT_INFO: 'add-habitat-information',
      LEGAL_AGREEMENT: 'add-legal-agreement',
      LOCAL_LAND_CHARGE: 'add-local-land-charge-search-certificate'
    })
  })

  it('should define the correct applicantInfo task', () => {
    const applicantInfo = taskDefinition(
      REGISTRATIONCONSTANTS.APPLICANT_INFO,
      'Add details about the applicant',
      constants.routes.AGENT_ACTING_FOR_CLIENT,
      constants.routes.CHECK_APPLICANT_INFORMATION,
      applicantInfoJourneys
    )

    expect(getTaskById(REGISTRATIONCONSTANTS.APPLICANT_INFO)).toEqual(applicantInfo)
  })

  it('should return null for undefined task ID', () => {
    expect(getTaskById('undefined-task-id')).toBeNull()
  })

  it('should define the correct checkYourAnswers object', () => {
    expect(checkYourAnswers).toEqual({
      taskTitle: 'Submit your biodiversity gain information',
      tasks: [{
        id: 'check-your-answers',
        title: 'Check your answers before you submit them',
        url: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
        status: constants.CANNOT_START_YET_STATUS
      }]
    })
  })

  it.only('should define the correct taskSections array', () => {
    const applicantInfo = taskDefinition(
      REGISTRATIONCONSTANTS.APPLICANT_INFO,
      'Add details about the applicant',
      constants.routes.AGENT_ACTING_FOR_CLIENT,
      constants.routes.CHECK_APPLICANT_INFORMATION,
      applicantInfoJourneys
    )
    const gainSiteAllocationInformation = taskDefinition(
      'gain-site-allocation-info',
      'Add biodiversity gain site details',
      constants.routes.DEVELOPER_BNG_NUMBER,
      constants.routes.DEVELOPER_BNG_NUMBER,
      allocationInformationJourneys
    )
    const appInfoId = 'app-info-id'
    const devInfoId = 'dev-info-id'
    const expectedTaskSections = [
      taskSectionDefinition('Applicant information', [applicantInfo], appInfoId),
      taskSectionDefinition('Development information', [
        gainSiteAllocationInformation
      ],
      devInfoId,
      [appInfoId])]

    expect(taskSections).toEqual(expectedTaskSections)
  })

  it('should freeze taskSections and checkYourAnswers objects', () => {
    expect(Object.isFrozen(taskSections)).toBe(true)
    expect(Object.isFrozen(checkYourAnswers)).toBe(true)
  })
})
