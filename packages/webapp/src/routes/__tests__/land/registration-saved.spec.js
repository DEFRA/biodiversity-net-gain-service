import constants from '../../../utils/constants'
import registrationSaved from '../../land/registration-saved.js'
import applicationSession from '../../../__mocks__/application-session.js'

jest.mock('../../../utils/http.js')

const url = constants.routes.REGISTRATION_SAVED

describe(url, () => {
  describe('GET', () => {
    it('Should save a valid request to the database', async () => {
      const getHandler = registrationSaved[0].handler
      const session = applicationSession()
      const referer = 'http://localhost:3000/land/register-task-list'
      let viewArgs = ''
      const h = {
        view: (...args) => {
          viewArgs = args
        }
      }
      const gainSiteReference = 'TEST-00000001-AKD3'
      const http = require('../../../utils/http.js')
      http.postJson = jest.fn().mockImplementation(() => {
        return gainSiteReference
      })

      await getHandler({
        yar: session,
        headers: {
          referer
        }
      }, h)
      expect(viewArgs[0]).toEqual(constants.views.REGISTRATION_SAVED)
      expect(viewArgs[1].applicationReference).toEqual(gainSiteReference)
      expect(session.values.length).toEqual(0)
    })
    it('Should not save if no email address is present', async () => {
      const getHandler = registrationSaved[0].handler
      const session = applicationSession()
      const referer = 'http://localhost:3000/land/register-task-list'
      session.set(constants.redisKeys.EMAIL_VALUE, undefined)
      await expect(getHandler({
        yar: session,
        headers: {
          referer
        }
      }))
        .rejects
        .toThrow('No email present for saving application Session')
    })
  })
})
