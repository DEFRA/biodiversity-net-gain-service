import * as cache from '../cache.js'

describe('cache', () => {
  it('it is a cache plugin', () => {
    expect(cache.default[0].name).toEqual('redis_cache')
    // expect(typeof cache.default[0].provider.options.tls.checkServerIdentity).toEqual('function')
    // expect(cache.default[0].provider.options.tls.checkServerIdentity()).toEqual(undefined)
  })
})
