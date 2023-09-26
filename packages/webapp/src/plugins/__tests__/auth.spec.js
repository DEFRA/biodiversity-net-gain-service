import plugin from '../auth.js'
import auth from '../../utils/auth.js'

// Inject fake server to get at validate function
let strategyOptions
const server = {
  register: () => { },
  auth: {
    strategy: (_strategy, _cookie, options) => {
      strategyOptions = options
    },
    default: () => { }
  }
}
plugin.register(server, {})

describe('auth plugin', () => {
  it('is a plugin', () => {
    expect(plugin.name).toEqual('auth')
    expect(typeof plugin.register).toEqual('function')
  })
  it('Should validate a valid session account', async () => {
    const spyOn = jest.spyOn(auth, 'refresh')
    const response = await strategyOptions.validate({}, {
      account: {
        idTokenClaims: {
          // set expiry time to an hour later
          exp: (new Date().getTime() + 60 * 60 * 1000) / 1000
        }
      }
    })
    expect(response.isValid).toEqual(true)
    expect(spyOn).toHaveBeenCalledTimes(0)
  })
  it('Should invalidate an invalid session account', async () => {
    const spyOn = jest.spyOn(auth, 'refresh')
    const response = await strategyOptions.validate({}, {})
    expect(response.isValid).toEqual(false)
    expect(spyOn).toHaveBeenCalledTimes(0)
  })
  it('Should validate an expired account via valid refresh', async () => {
    auth.refresh = jest.fn().mockImplementation(async () => {
      return {
        account: 'test'
      }
    })
    const response = await strategyOptions.validate({
      cookieAuth: {
        set: () => {}
      }
    }, {
      account: {
        idTokenClaims: {
          // set expiry time to an hour before
          exp: (new Date().getTime() - 60 * 60 * 1000) / 1000
        }
      }
    })
    expect(response.isValid).toEqual(true)
    expect(auth.refresh).toHaveBeenCalledTimes(1)
  })
})
