import constants from '../../../utils/constants'
import session from '../../../__mocks__/session'
import registrationSaved from '../../land/registration-saved.js'
import applicationSession from '../../../__mocks__/application-session.js'

jest.mock('../../../utils/http.js')

const url = constants.routes.REGISTRATION_SAVED

describe(url, () => {
  it('Should save a valid request to the database', async () => {
    const getHandler = registrationSaved[0].handler
    const session = applicationSession()
    const referer = 'http://localhost:3000/land/register-task-list'
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

    const http = require('../../../utils/http.js')
    http.postJson = jest.fn().mockImplementation(() => {
      return 'REF1234567890'
    })

    await getHandler({ 
      yar: session,
      headers: {
        referer: referer
      }
    }, h)
    expect(viewArgs[0]).toEqual(constants.views.REGISTRATION_SAVED)
    expect(viewArgs[1].gainSiteReference).toEqual('REF-123 456 7890')
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
        referer: referer
      }
    }))
    .rejects
    .toThrow('No email present for saving application Session')
  })
})
