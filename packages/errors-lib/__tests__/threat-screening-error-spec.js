import { ThreatScreeningError } from '../src/errors.js'

const threatScreeningDetails = {}

describe('Threat screening errors', () => {
  it('should supplement a standard Error with threat screening failure details', async () => {
    try {
      throw new ThreatScreeningError(threatScreeningDetails)
    } catch (err) {
      expect(err.threatScreeningDetails).toStrictEqual(threatScreeningDetails)
    }
  })
})
