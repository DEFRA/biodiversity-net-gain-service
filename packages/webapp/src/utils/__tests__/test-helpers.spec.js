import {
  listArray,
  boolToYesNo,
  dateToString,
  hideClass,
  getAllLandowners,
  getDeveloperEligibilityResults,
  getHumanReadableFileSize,
  emailValidator,
  getErrById,
  initialCapitalization
} from '../helpers.js'

import Session from '../../__mocks__/session.js'
import constants from '../../utils/constants.js'

describe('helpers file', () => {
  describe('boolToYesNo', () => {
    it('Should return Yes string for true', () => {
      expect(boolToYesNo(true)).toEqual('Yes')
    })
    it('Should return Yes string for true string', () => {
      expect(boolToYesNo('true')).toEqual('Yes')
    })
    it('Should return No string for false', () => {
      expect(boolToYesNo(false)).toEqual('No')
    })
    it('Should return No string for false string', () => {
      expect(boolToYesNo('false')).toEqual('No')
    })
  })
  describe('initialCapitalization', () => {
    it('Should return Yes string for yes', () => {
      expect(initialCapitalization('yes')).toEqual('Yes')
    })
    it('Should return No string for no', () => {
      expect(initialCapitalization('no')).toEqual('No')
    })
  })
  describe('listArray', () => {
    it('Should list an array as HTML with line breaks', () => {
      expect(listArray(['test1', 'test2', 'test3'])).toEqual(' test1 <br> test2 <br> test3 ')
    })
    it('Should list a single item', () => {
      expect(listArray(['test1'])).toEqual(' test1 ')
    })
    it('Should list no items', () => {
      expect(listArray([])).toEqual('')
    })
  })
  describe('dateToString', () => {
    it('Should format a date correctly', () => {
      expect(dateToString('2022-12-12T00:00:00.000Z')).toEqual('12 December 2022')
    })
    it('Should format a date correctly', () => {
      expect(dateToString('2022-06-01T00:00:00.000Z')).toEqual('01 June 2022')
    })
    it('Should format a date correctly with different format', () => {
      expect(dateToString('2022-06-01T00:00:00.000Z', 'DD MM YYYY')).toEqual('01 06 2022')
    })
  })
  describe('hideClass', () => {
    it('Should return hidden if true passed in', () => {
      expect(hideClass(true)).toEqual('hidden')
    })
    it('Should return empty string if false passed in', () => {
      expect(hideClass(false)).toEqual('')
    })
  })
  describe('getAllLandowners', () => {
    it('should just return list of landowners if applicant is not a landowner', () => {
      const session = new Session()
      session.set(constants.redisKeys.LANDOWNERS, ['Jane Smith'])
      session.set(constants.redisKeys.FULL_NAME, 'John Smith')
      session.set(constants.redisKeys.ROLE_KEY, 'Other')
      const list = getAllLandowners(session)
      expect(list).toEqual(['Jane Smith'])
    })
    it('should return a list of landowners with applicant at start if is a landowner', () => {
      const session = new Session()
      session.set(constants.redisKeys.LANDOWNERS, ['Jane Smith'])
      session.set(constants.redisKeys.FULL_NAME, 'John Smith')
      session.set(constants.redisKeys.ROLE_KEY, 'Landowner')
      const list = getAllLandowners(session)
      expect(list).toEqual(['John Smith', 'Jane Smith'])
    })
    it('should return an array of just the applicant if landowner and no others', () => {
      const session = new Session()
      session.set(constants.redisKeys.LANDOWNERS, [])
      session.set(constants.redisKeys.FULL_NAME, 'John Smith')
      session.set(constants.redisKeys.ROLE_KEY, 'Landowner')
      const list = getAllLandowners(session)
      expect(list).toEqual(['John Smith'])
    })
    it('should return an empty array if not landowner and no others', () => {
      const session = new Session()
      session.set(constants.redisKeys.LANDOWNERS, [])
      session.set(constants.redisKeys.FULL_NAME, 'John Smith')
      session.set(constants.redisKeys.ROLE_KEY, 'Other')
      const list = getAllLandowners(session)
      expect(list).toEqual([])
    })
  })

  describe('getDeveloperEligibilityResults', () => {
    it('should organise eligibility results correctly', () => {
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE, 'yes')
      session.set(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE, 'yes')
      const results = getDeveloperEligibilityResults(session)
      expect(results.yes.length).toEqual(2)
    })
    it('should organise eligibility results correctly', () => {
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE, 'yes')
      session.set(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE, 'no')
      const results = getDeveloperEligibilityResults(session)
      expect(results.yes.length).toEqual(1)
      expect(results.no.length).toEqual(1)
      expect(results['not-sure'].length).toEqual(0)
    })
    it('should organise eligibility results correctly', () => {
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE, 'yes')
      session.set(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE, 'not-sure')
      const results = getDeveloperEligibilityResults(session)
      expect(results.yes.length).toEqual(1)
      expect(results.no.length).toEqual(0)
      expect(results['not-sure'].length).toEqual(1)
    })
    it('should organise eligibility results correctly', () => {
      const session = new Session()
      session.set(constants.redisKeys.DEVELOPER_WRITTEN_CONTENT_VALUE, 'no')
      session.set(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE, 'no')
      const results = getDeveloperEligibilityResults(session)
      expect(results.no.length).toEqual(2)
    })
  })
  describe('getHumamReadableFileSize', () => {
    it('should convert a file size below 1MB to kilobytes', () => {
      expect(getHumanReadableFileSize(512)).toEqual('0.5 kB')
    })
    it('should convert a file size avove 1MB to megabytes', () => {
      expect(getHumanReadableFileSize(2097152)).toStrictEqual('2 MB')
    })
  })
  // Test coverage for getMaximumFileSizeExceededView is provided as part of tests in other files.

  describe('emailValidator', () => {
    it('should throw unexpected error of invalid input is submitted', () => {
      expect(emailValidator([''], '#id-1')).toEqual({
        err: [
          {
            href: '#id-1',
            text: 'Unexpected valdation error'
          }
        ]
      })
    })
  })

  describe('getErrById', () => {
    it('should return error object if attribute id is found in error\'s array', () => {
      const mockErrors = [{ href: '#id-1', text: 'mock error' }]
      expect(getErrById(mockErrors, 'id-1')).toEqual(mockErrors[0])
    })
    it('should return undefined if attribute id is not found in error\'s array', () => {
      const mockErrors = [{ href: '#id-2', text: 'mock error' }]
      expect(getErrById(mockErrors, 'id-1')).toBeUndefined()
    })
    it('should return undefined if empty error\'s array is provided', () => {
      const mockErrors = []
      expect(getErrById(mockErrors, 'id-1')).toBeUndefined()
    })
  })
})
