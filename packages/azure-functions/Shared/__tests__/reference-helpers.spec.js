import { randomReferenceString, retryDbOperation } from '../reference-helpers.js'

describe('randomReferenceString', () => {
  test('returns a string of specified length', () => {
    const length = 10
    const result = randomReferenceString(length)
    expect(result.length).toBe(length)
  })

  test('returns a string containing only valid characters', () => {
    const length = 10
    const result = randomReferenceString(length)
    const validChars = /^[0-9A-Z]+$/
    expect(result).toMatch(validChars)
  })
})

const mockQuery = jest.fn()

describe('retry', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('calls query function once and returns result if successful', async () => {
    const mockResult = 'success'
    mockQuery.mockResolvedValue(mockResult)
    const options = ['param1', 'param2']
    const result = await retryDbOperation(mockQuery, options)
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(mockQuery).toHaveBeenCalledWith(...options)
    expect(result).toBe(mockResult)
  })

  test('calls query function 5 times and throws error if all attempts fail', async () => {
    const mockError = new Error('Query failed')
    mockQuery.mockRejectedValue(mockError)
    const options = ['param1', 'param2']
    await expect(retryDbOperation(mockQuery, options)).rejects.toThrow(mockError)
    expect(mockQuery).toHaveBeenCalledTimes(5)
    expect(mockQuery).toHaveBeenNthCalledWith(5, ...options)
  })

  test('calls query function 3 times and returns result if successful in one of the attempts', async () => {
    const mockResult = 'success'
    mockQuery.mockRejectedValueOnce(new Error('Attempt 1 failed'))
    mockQuery.mockRejectedValueOnce(new Error('Attempt 2 failed'))
    mockQuery.mockResolvedValueOnce(mockResult)
    const options = ['param1', 'param2']
    const result = await retryDbOperation(mockQuery, options, 3)
    expect(mockQuery).toHaveBeenCalledTimes(3)
    expect(result).toBe(mockResult)
  })
})
