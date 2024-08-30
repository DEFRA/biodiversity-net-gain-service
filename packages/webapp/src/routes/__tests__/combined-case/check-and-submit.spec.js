import { submitGetRequest } from '../helpers/server.js'
import combinedCaseApplicationData from '../../../__mocks__/combined-case-application-data.js'
import setDeveloperApplicationSession from '../../../__mocks__/combined-case-application-session.js'
import applicant from '../../../__mocks__/applicant.js'
import constants from '../../../utils/constants.js'
import * as taskListUtil from '../../../journey-validation/task-list-generator.js'

const checkAnswers = require('../../combined-case/check-and-submit.js').default
const url = constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT

jest.mock('../../../utils/http.js')
jest.mock('../../../utils/helpers.js')

const auth = {
  credentials: {
    account: applicant,
    idTokenClaims: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@test.com',
      contactId: 'mock contact id',
      enrolmentCount: 2,
      currentRelationshipId: 'mock relationship id',
      relationships: ['mock relationship id:::0:Citizen:0'],
      roles: ['mock relationship id:Standard User:2']
    }
  }
}

describe(url, () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view `, async () => {
      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: true })

      const res = await submitGetRequest({ url }, 200, combinedCaseApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })

    it('should redirect the view when already submitted', async () => {
      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: false })
      const session = {
        [constants.redisKeys.COMBINED_CASE_APPLICATION_SUBMITTED]: true
      }
      const res = await submitGetRequest({ url }, 302, { ...combinedCaseApplicationData, ...session })
      expect(res.payload).not.toContain('Geoff')
    })

    it('should redirect the view for an organisation application when canSubmit is false', async () => {
      jest.spyOn(taskListUtil, 'getTaskList').mockReturnValue({ canSubmit: false })

      const res = await submitGetRequest({ url }, 302, combinedCaseApplicationData)
      expect(res.payload).not.toContain('Geoff')
    })
  })

  describe('POST', () => {
    it('should process a valid application correctly', async () => {
      const session = setDeveloperApplicationSession()
      session.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, '123')
      const postHandler = checkAnswers[1].handler

      jest.mock('../../../utils/http.js')
      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockReturnValue({ applicationReference: 'test-reference' })

      const payload = { termsAndConditionsConfirmed: 'Yes' }
      const h = {
        view: jest.fn(),
        redirect: jest.fn()
      }

      await postHandler({ yar: session, auth, payload }, h)
      expect(h.view).not.toHaveBeenCalled()
      expect(h.redirect).toHaveBeenCalledWith(constants.routes.COMBINED_CASE_CONFIRMATION)
    })

    it('should fail if backend errors', async () => {
      const session = setDeveloperApplicationSession()
      session.set(constants.redisKeys.COMBINED_CASE_APPLICATION_REFERENCE, '123')
      const postHandler = checkAnswers[1].handler

      jest.mock('../../../utils/http.js')
      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockImplementation(() => {
        throw new Error('test error')
      })

      const payload = { termsAndConditionsConfirmed: 'Yes' }
      await expect(postHandler({ yar: session, auth, payload })).rejects.toThrow('test error')
    })

    it('should display an error message if user has not confirmed reading terms and conditions', async () => {
      const session = setDeveloperApplicationSession()
      const postHandler = checkAnswers[1].handler

      const payload = { termsAndConditionsConfirmed: 'No' }
      const h = {
        view: jest.fn(),
        redirect: jest.fn()
      }

      await postHandler({ payload, auth, yar: session }, h)

      expect(h.view).toHaveBeenCalledWith(
        constants.views.COMBINED_CASE_CHECK_AND_SUBMIT,
        expect.objectContaining({
          err: [{
            text: 'You must confirm you have read the terms and conditions',
            href: '#termsAndConditionsConfirmed'
          }]
        })
      )
    })
  })
})

// Unit tests for getMatchedHabitats
describe('getMatchedHabitats', () => {
  const { getMatchedHabitats } = require('../../combined-case/check-and-submit.js')

  it('should return an empty array if no habitats are matched', () => {
    const result = getMatchedHabitats([])
    expect(result).toEqual([])
  })

  it('should return an empty array when habitats is null', () => {
    const result = getMatchedHabitats(null)
    expect(result).toEqual([])
  })

  it('should return an empty array when habitats is undefined', () => {
    const result = getMatchedHabitats(undefined)
    expect(result).toEqual([])
  })

  it('should group habitats by state and calculate totals', () => {
    const habitats = [
      { state: 'Habitat', habitatType: 'Grassland', condition: 'Good', size: 10, measurementUnits: 'hectares', habitatUnitsDelivered: 5.5 },
      { state: 'Hedge', habitatType: 'Native hedgerow', condition: 'Fair', size: 12, measurementUnits: 'kilometres', habitatUnitsDelivered: 3.0 },
      { state: 'Watercourse', habitatType: 'River', condition: 'Poor', size: 0.5, measurementUnits: 'kilometres', habitatUnitsDelivered: 1.5 }
    ]

    const result = getMatchedHabitats(habitats)
    expect(result).toEqual([
      [
        { text: 'Grassland' },
        { html: 'Good' },
        { html: '10&nbsp;ha' },
        { html: '5.5&nbsp;units' }
      ],
      [
        { text: 'Total habitat units', colspan: 3, classes: 'table-heavy-border' },
        { text: '5.5 units', classes: 'table-heavy-border' }
      ],
      [
        { text: 'Native hedgerow', classes: 'table-extra-padding' },
        { html: 'Fair', classes: 'table-extra-padding' },
        { html: '12&nbsp;km', classes: 'table-extra-padding' },
        { html: '3.0&nbsp;units', classes: 'table-extra-padding' }
      ],
      [
        { text: 'Total hedgerow units', colspan: 3, classes: 'table-heavy-border' },
        { text: '3.0 units', classes: 'table-heavy-border' }
      ],
      [
        { text: 'River', classes: 'table-extra-padding' },
        { html: 'Poor', classes: 'table-extra-padding' },
        { html: '0.5&nbsp;km', classes: 'table-extra-padding' },
        { html: '1.5&nbsp;units', classes: 'table-extra-padding' }
      ],
      [
        { text: 'Total watercourse units', colspan: 3, classes: 'table-heavy-border' },
        { text: '1.5 units', classes: 'table-heavy-border' }
      ]
    ])
  })

  it('should handle habitatUnitsDelivered being undefined', () => {
    const habitat = { state: 'Habitat', habitatType: 'Grassland', condition: 'Good', size: 10, measurementUnits: 'hectares' }
    const habitatUnitsDelivered = habitat.habitatUnitsDelivered || 0

    expect(habitatUnitsDelivered).toBe(0)
  })

  it('should handle habitatUnitsDelivered being defined', () => {
    const habitat = { state: 'Habitat', habitatType: 'Grassland', condition: 'Good', size: 10, measurementUnits: 'hectares', habitatUnitsDelivered: 5.5 }
    const habitatUnitsDelivered = habitat.habitatUnitsDelivered || 0

    expect(habitatUnitsDelivered).toBe(5.5)
  })

  it('should handle habitatUnitsDelivered being undefined', () => {
    const habitats = [
      { state: 'Habitat', habitatType: 'Grassland', condition: 'Good', size: 10, measurementUnits: 'hectares' },
      { state: 'Hedge', habitatType: 'Native hedgerow', condition: 'Fair', size: 12, measurementUnits: 'kilometres' }
    ]

    const result = getMatchedHabitats(habitats)
    expect(result).toEqual([])
  })
})
