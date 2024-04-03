describe('cache', () => {
  let cache
  beforeEach(() => {
    jest.resetModules()
  })
  it('it is a cache plugin', async () => {
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('memory_cache')
  })
  it('it has undefined maxByteSize if maxByteSize env var is undefined', async () => {
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('memory_cache')
    expect(cache.default[0].provider.options.maxByteSize).toEqual(undefined)
  })
  it('it has undefined minCleanupIntervalMsec if minCleanupIntervalMsec env var is undefined', async () => {
    process.env.REDIS_TLS = 'false'
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('memory_cache')
    expect(cache.default[0].provider.options.minCleanupIntervalMsec).toEqual(undefined)
  })
  it('it has undefined cloneBuffersOnGet if cloneBuffersOnGet env var is undefined', async () => {
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('memory_cache')
    expect(cache.default[0].provider.options.cloneBuffersOnGet).toEqual(undefined)
  })
  it('it has maxByteSize set by CACHE_MAX_BYTE_SIZE', async () => {
    const byteSize = 2000
    process.env.CACHE_MAX_BYTE_SIZE = byteSize
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('memory_cache')
    expect(cache.default[0].provider.options.maxByteSize).toEqual(byteSize)
  })
  it('it has minCleanupIntervalMsec set by CACHE_CLEANUP_INT_MIN_SEC', async () => {
    const minCleanupIntervalMsec = 5000
    process.env.CACHE_CLEANUP_INT_MIN_SEC = minCleanupIntervalMsec
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('memory_cache')
    expect(cache.default[0].provider.options.minCleanupIntervalMsec).toEqual(minCleanupIntervalMsec)
  })
  it('it has cloneBuffersOnGet set by CACHE_CLONE_BUFFER_ON', async () => {
    const cloneBuffersOnGet = true
    process.env.CACHE_CLONE_BUFFER_ON = cloneBuffersOnGet
    cache = await import('../cache.js')
    expect(cache.default[0].name).toEqual('memory_cache')
    expect(cache.default[0].provider.options.cloneBuffersOnGet).toEqual(cloneBuffersOnGet)
  })
})
