import { MetricExtractionError } from '../src/errors.js'

const errorCode = 'mock error code'
const errorMessage = 'mock error message'

describe('Metric extraction errors', () => {
  it('should supplement a standard Error with an error code', async () => {
    try {
      throw new MetricExtractionError(errorCode, errorMessage)
    } catch (err) {
      expect(err.code).toBe(errorCode)
      expect(err.message).toBe(errorMessage)
    }
  })
})
