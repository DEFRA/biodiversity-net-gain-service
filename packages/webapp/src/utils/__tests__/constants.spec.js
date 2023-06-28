describe('Constants', () => {
  beforeEach(() => {
    jest.resetModules()
  })
  it('Should load test routes if NODE_ENV is set to development', () => {
    const NODE_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'
    const constants = require('../constants')
    expect(constants.default.routes.TEST_SEED_DATA).toEqual('/test/seed-data')
    process.env.NODE_ENV = NODE_ENV
  })

  it('Should load test routes if NODE_ENV is set to development', () => {
    const NODE_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const constants = require('../constants')
    expect(constants.default.routes.TEST_SEED_DATA).toEqual('/test/seed-data')
    process.env.NODE_ENV = NODE_ENV
  })

  it('Should not load test routes if NODE_ENV is set to production', () => {
    const NODE_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    const constants = require('../constants')
    expect(constants.default.routes.TEST_SEED_DATA).toEqual(undefined)
    process.env.NODE_ENV = NODE_ENV
  })
})
