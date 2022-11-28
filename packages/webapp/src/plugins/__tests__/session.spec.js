describe('session', () => {
  it('Should return normal session object', done => {
    jest.isolateModules(async () => {
      try {
        const session = require('../session')
        expect(session.default.options).not.toBeUndefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should return session object with cookie isSecure as true if environment variable set to true', done => {
    jest.isolateModules(async () => {
      try {
        process.env.COOKIE_IS_SECURE = 'true'
        const session = require('../session')
        expect(session.default.options).not.toBeUndefined()
        expect(session.default.options.cookieOptions.isSecure).toEqual(true)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should return session object with cookie isSecure as false if environment variable set to false', done => {
    jest.isolateModules(async () => {
      try {
        process.env.COOKIE_IS_SECURE = 'false'
        const session = require('../session')
        expect(session.default.options).not.toBeUndefined()
        expect(session.default.options.cookieOptions.isSecure).toEqual(false)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
