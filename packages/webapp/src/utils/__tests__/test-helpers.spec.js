import {
  listArray,
  boolToYesNo,
  dateToString,
  hideClass,
  getAllLandowners,
  getDeveloperEligibilityResults,
  getHumanReadableFileSize,
  emailValidator,
  checkForDuplicate,
  checkForDuplicateConcatenated,
  getErrById,
  initialCapitalization,
  isValidPostcode,
  validateLengthOfCharsLessThan50,
  validateDate,
  validateAddress
} from '../helpers.js'

import Session from '../../__mocks__/session.js'
import constants from '../constants.js'

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

  describe('isValidPostcode', () => {
    it('Should validate valid postcodes', () => {
      const postcodes = [
        'WA4 1HT',
        'SQ1W 0NY',
        'PO16 7GZ',
        'GU16 7HF',
        'L1 8JQ',
        'WA41HT',
        'SQ1W0NY',
        'PO167GZ',
        'GU167HF',
        'L18JQ'
      ]
      postcodes.forEach(postcode => {
        expect(isValidPostcode(postcode)).toBeTruthy()
      })
    })
    it('Should invalidate invalid postcodes', () => {
      const postcodes = [
        'XXXXXX',
        'X1',
        'WA4'
      ]
      postcodes.forEach(postcode => {
        expect(isValidPostcode(postcode)).toBeFalsy()
      })
    })
  })
})

describe('checkForDuplicate organisation', () => {
  const testArray = [
    { organisationName: 'org2', type: 'organisation' },
    { organisationName: 'org2', type: 'organisation' },
    { organisationName: 'org3', type: 'organisation' },
    { firstName: 'John', middleNames: 'a', lastName: 'Cs', type: 'individual' },
    { firstName: 'John', middleNames: '', lastName: 'Cris', type: 'individual' }
  ]
  it('should return an error object if a duplicate is found for organsation', () => {
    const result = checkForDuplicate(
      testArray,
      'organisationName',
      'org2',
      '#organisationName',
      'This organisation has already been added - enter a different organisation, if there is one',
      null // Assuming excludeIndex is not used in this case
    )

    expect(result).toEqual({
      err: {
        text: 'This organisation has already been added - enter a different organisation, if there is one',
        href: '#organisationName'
      }
    })
  })
  it('should not return an error if duplicate is at the excluded index for organsation', () => {
    const result = checkForDuplicate(
      testArray,
      'organisationName',
      'org1',
      '#organisationName',
      'This organisation name is already in use',
      0 // Exclude the first index
    )

    expect(result).toBeNull()
  })
  it('should return an error object if a duplicate is found the excluded index for organsation', () => {
    const result = checkForDuplicate(
      testArray,
      'organisationName',
      'org3',
      '#organisationName',
      'This organisation has already been added - enter a different organisation, if there is one',
      0 // Exclude the first index
    )

    expect(result).toEqual({
      err: {
        text: 'This organisation has already been added - enter a different organisation, if there is one',
        href: '#organisationName'
      }
    })
  })
})

describe('checkForDuplicate for LPA list', () => {
  it('should return an error object if a duplicate LPA is found', () => {
    const lpaList = ['Planning Authority 1', 'Planning Authority 2', 'Planning Authority 1']

    const selectedLpa = 'Planning Authority 1'
    const result = checkForDuplicate(
      lpaList,
      null, // No property since it's an array of strings
      selectedLpa,
      '#localPlanningAuthority',
      'This local planning authority has already been added - enter a different local planning authority, if there is one',
      null // Assuming excludeIndex is not used in this case
    )

    expect(result).toEqual({
      err: {
        text: 'This local planning authority has already been added - enter a different local planning authority, if there is one',
        href: '#localPlanningAuthority'
      }
    })
  })

  it('should not return an error if the duplicate LPA is at the excluded index', () => {
    const lpaList = ['Planning Authority 1', 'Planning Authority 2', 'Planning Authority 3']
    const selectedLpa = 'Planning Authority 1'
    const excludeIndex = 0 // Exclude the first index where the duplicate is
    const result = checkForDuplicate(
      lpaList,
      null, // No property since it's an array of strings
      selectedLpa,
      '#localPlanningAuthority',
      'This local planning authority has already been added - enter a different local planning authority, if there is one',
      excludeIndex
    )

    expect(result).toBeNull()
  })
  it('should not return an error if duplicate is at the excluded index for lpa', () => {
    const lpaList = ['Planning Authority 1', 'Planning Authority 2', 'Planning Authority 3']
    const selectedLpa = 'Planning Authority 2'
    const excludeIndex = 0 // Exclude the first index where the duplicate is
    const result = checkForDuplicate(
      lpaList,
      null, // No property since it's an array of strings
      selectedLpa,
      '#localPlanningAuthority',
      'This local planning authority has already been added - enter a different local planning authority, if there is one',
      excludeIndex
    )
    expect(result).toEqual({
      err: {
        text: 'This local planning authority has already been added - enter a different local planning authority, if there is one',
        href: '#localPlanningAuthority'
      }
    })
  })
})

describe('checkForDuplicateConcatenated', () => {
  const testArray = [
    { organisationName: 'org2', type: 'organisation' },
    { organisationName: 'org2', type: 'organisation' },
    { organisationName: 'org3', type: 'organisation' },
    { firstName: 'John', middleNames: 'a', lastName: 'Cs', type: 'individual' },
    { firstName: 'John', middleNames: '', lastName: 'Cris', type: 'individual' },
    { firstName: 'Jane', middleNames: 'b', lastName: 'Doe', type: 'individual' }
  ]

  it('should return an error object if a duplicate individual is found', () => {
    const individual = { firstName: 'John', middleNames: '', lastName: 'Cris' }
    const excludeIndex = null // Not excluding any index

    const result = checkForDuplicateConcatenated(
      testArray,
      ['firstName', 'middleNames', 'lastName'],
      individual,
      '#personName',
      'This landowner or leaseholder has already been added - enter a different landowner or leaseholder, if there is one',
      excludeIndex
    )

    expect(result).toEqual({
      err: {
        text: 'This landowner or leaseholder has already been added - enter a different landowner or leaseholder, if there is one',
        href: '#personName'
      }
    })
  })

  it('should not return an error if the duplicate individual is at the excluded index', () => {
    const individual = { firstName: 'John', middleNames: 'a', lastName: 'Cs' }
    const excludeIndex = 3 // Exclude the first index where the duplicate is

    const result = checkForDuplicateConcatenated(
      testArray,
      ['firstName', 'middleNames', 'lastName'],
      individual,
      '#personName',
      'This landowner or leaseholder has already been added - enter a different landowner or leaseholder, if there is one',
      excludeIndex
    )

    expect(result).toBeNull()
  })

  it('should return an error object if a duplicate is found the excluded index for organsation', () => {
    const individual = { firstName: 'John', middleNames: 'a', lastName: 'Cs' }
    const excludeIndex = 4 // Exclude the first index where the duplicate is

    const result = checkForDuplicateConcatenated(
      testArray,
      ['firstName', 'middleNames', 'lastName'],
      individual,
      '#personName',
      'This landowner or leaseholder has already been added - enter a different landowner or leaseholder, if there is one',
      excludeIndex
    )
    expect(result).toEqual({
      err: {
        text: 'This landowner or leaseholder has already been added - enter a different landowner or leaseholder, if there is one',
        href: '#personName'
      }
    })
  })
})

describe('validateLengthOfCharsLessThan50', () => {
  it('should return error if input character length is more than 50', () => {
    const middleNameError = validateLengthOfCharsLessThan50(
      'this is a very long string this is a very long string this is a very long string this is a very long string this is a very long string this is a very long string this is a very long string this is a very long string this is a very long string this is a very long string this is a very long string',
      'middle name', 'middleNameId')
    expect(middleNameError.err[0].text).toEqual('Middle name must be 50 characters or fewer')
  })
})

describe('validateDate', () => {
  it('should return date error when day is not included', () => {
    const result = validateDate(
      {
        'legalAgreementStartDate-day': '',
        'legalAgreementStartDate-month': '01',
        'legalAgreementStartDate-year': '2023'
      },
      'legalAgreementStartDate'
    )

    expect(result.context.err[0].text).toBe('Start date must include a day')
  })

  it('should return date  when day is not included', () => {
    const result = validateDate(
      {
        'legalAgreementStartDate-day': '01',
        'legalAgreementStartDate-month': '01',
        'legalAgreementStartDate-year': '2023'
      },
      'legalAgreementStartDate'
    )

    expect(result.dateAsISOString).toBe('2023-01-01T00:00:00.000Z')
  })

  it('should return date error when month is not included', () => {
    const result = validateDate(
      {
        'legalAgreementStartDate-day': '01',
        'legalAgreementStartDate-month': '',
        'legalAgreementStartDate-year': '2023'
      },
      'legalAgreementStartDate'
    )

    expect(result.context.err[0].text).toBe('Start date must include a month')
  })
})

describe('validateAddress', () => {
  it('should add addressLine1Error when length of chars is above 50', () => {
    const result = validateAddress({
      addressLine1: 'address line 1address line 1address line 1address line 1address line 1address line 1',
      addressLine2: 'address line 2',
      town: 'town',
      county: 'county',
      postcode: 'WA4 1HT'
    })

    expect(result.addressLine1Error.text).toBe('AddressLine1 must be 50 characters or fewer')
  })

  it('should add address line 2Error when length of chars is above 50', () => {
    const result = validateAddress({
      addressLine1: 'address line 1',
      addressLine2: 'address line 2address line 2address line 2address line 2address line 2address line 2address line 2address line 2',
      town: 'town',
      county: 'county',
      postcode: 'WA4 1HT'
    })

    expect(result.addressLine2Error.text).toBe('AddressLine2 must be 50 characters or fewer')
  })

  it('should add addressLine3Error when length of chars is above 50', () => {
    const result = validateAddress({
      addressLine1: 'address line 1',
      addressLine2: 'address line 2',
      addressLine3: 'address line 3address line 3address line 3address line 3address line 3address line 3address line 3address line 3',
      town: 'town',
      county: 'county',
      postcode: 'WA4 1HT'
    })

    expect(result.addressLine3Error.text).toBe('AddressLine3 must be 50 characters or fewer')
  })

  it('should add townError when length of chars is above 50', () => {
    const result = validateAddress({
      addressLine1: 'address line 1',
      addressLine2: 'address line 2',
      town: 'towntowntowntowntowntowntowntowntowntowntowntowntowntowntowntowntown',
      county: 'county',
      postcode: 'WA4 1HT'
    })

    expect(result.townError.text).toBe('Town must be 50 characters or fewer')
  })

  it('should add countyError when length of chars is above 50', () => {
    const result = validateAddress({
      addressLine1: 'address line 1',
      addressLine2: 'address line 2',
      town: 'town',
      county: 'countycountycountycountycountycountycountycountycountycountycounty',
      postcode: 'WA4 1HT'
    })

    expect(result.countyError.text).toBe('County must be 50 characters or fewer')
  })

  it('should add countryError when length of chars is above 50', () => {
    const result = validateAddress({
      addressLine1: 'address line 1',
      addressLine2: 'address line 2',
      town: 'town',
      country: 'countycountycountycountycountycountycountycountycountycountycounty',
      postcode: 'WA4 1HT'
    })

    expect(result.countryError.text).toBe('Country must be 50 characters or fewer')
  })
})
