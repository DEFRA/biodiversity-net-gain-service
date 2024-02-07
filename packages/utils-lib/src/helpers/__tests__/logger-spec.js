describe('The logger', () => {
  const timeout = 1000
  it('should be configured to log at warning level and above by default', done => {
    jest.isolateModules(() => {
      try {
        const logger = require('../logger.js')
        // Finishing the test in setImmediate is not long enough to conclude async operations
        setTimeout(() => {
          expect(logger.default.level).toEqual('warn')
          done()
        }, timeout)
      } catch (err) {
        setTimeout(() => {
          done(err)
        }, timeout)
      }
    })
  })
  it('should log at a configured level and above', done => {
    jest.isolateModules(() => {
      try {
        process.env.LOG_LEVEL = 'info'
        const logger = require('../logger.js')
        // Finishing the test in setImmediate is not long enough to conclude async operations
        setTimeout(async () => {
          expect(logger.default.level).toEqual('info')
          done()
        }, timeout)
      } catch (err) {
        setTimeout(() => {
          done(err)
        }, timeout)
      }
    })
  })
  it('should log at warning level when an invalid log level is configured', done => {
    jest.isolateModules(() => {
      try {
        process.env.LOG_LEVEL = 'invalid'
        // Change the NODE_ENV to confiure use of pino-pretty. This increases test coverage.
        process.env.NODE_ENV = 'development'
        const logger = require('../logger.js')
        // Finishing the test in setImmediate is not long enough to conclude async operations
        setTimeout(async () => {
          expect(logger.default.level).toEqual('warn')
          done()
        }, timeout)
      } catch (err) {
        setTimeout(() => {
          done(err)
        }, timeout)
      }
    })
  })
})
