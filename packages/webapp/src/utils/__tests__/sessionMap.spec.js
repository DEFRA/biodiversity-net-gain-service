import { SessionMap } from '../sessionMap.js'

describe('SessionMap', () => {
  let sessionMap

  beforeEach(() => {
    sessionMap = new SessionMap()
    sessionMap.set('key1', 'value1')
    sessionMap.set('key2', 'value2')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('clear', () => {
    it('should delete the specified key if it exists', () => {
      sessionMap.clear('key1')
      expect(sessionMap.has('key1')).toBe(false)
      expect(sessionMap.has('key2')).toBe(true)
    })

    it('should log a message if the key does not exist', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
      sessionMap.clear('nonExistingKey')
      expect(consoleLogSpy).toHaveBeenCalledWith('Key "nonExistingKey" not found in the map.')
      expect(sessionMap.has('key1')).toBe(true)
      expect(sessionMap.has('key2')).toBe(true)
    })

    it('should warn if no key is provided', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { })
      sessionMap.clear()
      expect(consoleWarnSpy).toHaveBeenCalledWith('No key provided to delete.')
      expect(sessionMap.has('key1')).toBe(true)
      expect(sessionMap.has('key2')).toBe(true)
    })
  })

  describe('originalClear', () => {
    it('should clear all entries in the map', () => {
      sessionMap.originalClear()
      expect(sessionMap.size).toBe(0)
    })
  })
})
