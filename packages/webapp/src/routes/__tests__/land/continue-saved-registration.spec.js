import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
import continueSavedRegistration from '../../land/continue-saved-registration.js'
import applicationSession from '../../../__mocks__/application-session.js'
import applicationMock from '../../../__mocks__/application-data.js'

jest.mock('../../../utils/http.js')

const url = constants.routes.CONTINUE_SAVED_REGISTRATION

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })
  describe('POST', () => {
    it('Happy path: should retrieve a valid request from the database and redirect to default Task list if no referer', async () => {
      const postHandler = continueSavedRegistration[1].handler
      const session = applicationSession()
      const payload = {
        email: 'test@test.com',
        applicationReference: 'REF1234567890'
      }
      let redirectArgs = ''
      const h = {
        redirect: (...args) => {
          redirectArgs = args
        }
      }

      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockImplementation(() => {
        return applicationMock
      })

      await postHandler({
        payload,
        yar: session
      }, h)
      expect(redirectArgs[0]).toEqual(constants.routes.REGISTER_LAND_TASK_LIST)
    })
    it('Happy path: should retrieve a valid request from the database and redirect to referer from session data', async () => {
      const postHandler = continueSavedRegistration[1].handler
      const session = applicationSession()
      const payload = {
        email: 'test@test.com',
        applicationReference: 'REF1234567890'
      }
      let redirectArgs = ''
      const h = {
        redirect: (...args) => {
          redirectArgs = args
        }
      }

      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockImplementation(() => {
        return {
          'registration-saved-referer': constants.routes.CHECK_AND_SUBMIT,
          ...applicationMock
        }
      })

      await postHandler({
        payload,
        yar: session
      }, h)
      expect(redirectArgs[0]).toEqual(constants.routes.CHECK_AND_SUBMIT)
    })
    it('Should fail validation if no email', async () => {
      const postHandler = continueSavedRegistration[1].handler
      const payload = {
        email: '',
        applicationReference: 'REF1234567890'
      }
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await postHandler({
        payload
      }, h)
      expect(viewArgs[0]).toEqual(constants.views.CONTINUE_SAVED_REGISTRATION)
      expect(viewArgs[1].err[0].text).toEqual('Enter the email address')
      expect(viewArgs[1].err[0].href).toEqual('#email')
      expect(viewArgs[1].err[1]).toEqual(undefined)
    })
    it('Should fail validation if no reference', async () => {
      const postHandler = continueSavedRegistration[1].handler
      const payload = {
        email: 'test@test.com',
        applicationReference: ''
      }
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await postHandler({
        payload
      }, h)
      expect(viewArgs[0]).toEqual(constants.views.CONTINUE_SAVED_REGISTRATION)
      expect(viewArgs[1].err[1].text).toEqual('Enter the reference number')
      expect(viewArgs[1].err[1].href).toEqual('#applicationReference')
      expect(viewArgs[1].err[0]).toEqual(undefined)
    })
    it('Should fail validation if neither email or reference', async () => {
      const postHandler = continueSavedRegistration[1].handler
      const payload = {
        email: '',
        applicationReference: ''
      }
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await postHandler({
        payload
      }, h)
      expect(viewArgs[0]).toEqual(constants.views.CONTINUE_SAVED_REGISTRATION)
      expect(viewArgs[1].err[0].text).toEqual('Enter the email address')
      expect(viewArgs[1].err[0].href).toEqual('#email')
      expect(viewArgs[1].err[1].text).toEqual('Enter the reference number')
      expect(viewArgs[1].err[1].href).toEqual('#applicationReference')
    })
    it('Should fail validation if reference invalid', async () => {
      const postHandler = continueSavedRegistration[1].handler
      const payload = {
        email: 'test@test.com',
        applicationReference: '123'
      }
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await postHandler({
        payload
      }, h)
      expect(viewArgs[0]).toEqual(constants.views.CONTINUE_SAVED_REGISTRATION)
      expect(viewArgs[1].err[0]).toEqual(undefined)
      expect(viewArgs[1].err[1].text).toEqual('Enter a reference number in the correct format')
      expect(viewArgs[1].err[1].href).toEqual('#applicationReference')
    })
    it('Should fail validation if email > 254 characters', async () => {
      const postHandler = continueSavedRegistration[1].handler
      const payload = {
        email: 'tiSV@61Uj9AEuRxDjrXod96Ez22VJE7exkmkXNY7SQ1Tz0GcEqfid7bKvvyxinrk3PyjvDY4lXW2Ju3l9wcs14tWq1ZF4RCObIKUlsDSh7CUX6yZvlT7a51TbrLsgClRWEzv6DmWWEHIUyT7uxQIiLt0XPspH1b7WyM51zelcmzOlaqnkVb2wFdGIMb5DqA1LFnCpJDbj86WCHm7rcB47qnmohiefIhZsmRWWIWZrEjSOAfCUsz4wttEofloPrFBrcqWtQ8uWGIZbnizQrtFoJXRpClG62V1SO9SpZKVkKotB.com',
        applicationReference: 'REF1234567890'
      }
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      await postHandler({
        payload
      }, h)
      expect(viewArgs[0]).toEqual(constants.views.CONTINUE_SAVED_REGISTRATION)
      expect(viewArgs[1].err[1]).toEqual(undefined)
      expect(viewArgs[1].err[0].text).toEqual('Email address must be 254 characters or less')
      expect(viewArgs[1].err[0].href).toEqual('#email')
    })
    it('Should fail if no data found in database', async () => {
      const postHandler = continueSavedRegistration[1].handler
      const session = applicationSession()
      const payload = {
        email: 'test@test.com',
        applicationReference: 'REF1234567890'
      }
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }

      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockImplementation(() => {
        return {}
      })

      await postHandler({
        payload,
        yar: session
      }, h)
      expect(viewArgs[0]).toEqual(constants.views.CONTINUE_SAVED_REGISTRATION)
      expect(viewArgs[1].err[0].text).toEqual('We do not recognise your email address or reference number, try again')
      expect(viewArgs[1].err[0].href).toEqual('#email')
      expect(viewArgs[1].err[1].text).toEqual('')
      expect(viewArgs[1].err[1].href).toEqual('#applicationReference')
    })
  })
})
