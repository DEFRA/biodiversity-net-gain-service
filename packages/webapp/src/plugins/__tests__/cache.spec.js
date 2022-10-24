describe('cache', () => {
  let cache
  beforeEach(() => {
    jest.resetModules()
  })
  it('it is a cache plugin', async () => {
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('redis_cache')
  })
  it('it has an undefined tls object if REDIS_TLS is undefined', async () => {
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('redis_cache')
    expect(cache.default[0].provider.options.tls).toEqual(undefined)
  })
  it('it has an undefined tls object if REDIS_TLS is false', async () => {
    process.env.REDIS_TLS = 'false'
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('redis_cache')
    expect(cache.default[0].provider.options.tls).toEqual(undefined)
  })
  it('it has a checkserveridentity function if REDIS_TLS is true', async () => {
    process.env.REDIS_TLS = 'true'
    cache = await import('../cache.js')
    expect(typeof cache.default[0].provider.options.tls.checkServerIdentity).toEqual('function')
    expect(cache.default[0].provider.options.tls.checkServerIdentity()).toEqual(undefined)
  })
})
