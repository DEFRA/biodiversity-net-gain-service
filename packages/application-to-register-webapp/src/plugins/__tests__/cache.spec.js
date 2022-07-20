describe('cache', () => {
  let cache
  beforeEach(() => {
    return import('../cache.js').then(module => {
      cache = module
      jest.resetModules()
    })
  })
  it('it is a cache plugin', () => {
    expect(cache.default[0].name).toEqual('redis_cache')
  })
  it('it has an undefined tls object if REDIS_TLS is false', () => {
    process.env.REDIS_TLS = false
    expect(cache.default[0].name).toEqual('redis_cache')
    expect(cache.default[0].provider.options.tls).toEqual(undefined)
  })
  it('it has a checkserveridentity function if REDIS_TLS is true', () => {
    process.env.REDIS_TLS = true
    expect(typeof cache.default[0].provider.options.tls.checkServerIdentity).toEqual('function')
    expect(cache.default[0].provider.options.tls.checkServerIdentity()).toEqual(undefined)
  })
})
