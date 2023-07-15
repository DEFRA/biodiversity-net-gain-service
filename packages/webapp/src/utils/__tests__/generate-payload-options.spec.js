import { generatePayloadOptions } from '../generate-payload-options'

describe('generatePayloadOptions', () => {
  it('should return correct payload options', () => {
    const maxFileSize = 50
    const href = '#localChargeSearchCertificate'
    const view = 'land/upload-local-and-land-search-certificate'
    const result = generatePayloadOptions(href, maxFileSize, view)
    expect(result.payload.maxBytes).toBe((parseInt(maxFileSize) + 1) * 1024 * 1024)
    expect(result.payload.multipart).toBe(true)
    expect(result.payload.timeout).toBe(false)
    expect(result.payload.output).toBe('stream')
    expect(result.payload.parse).toBe(false)
    expect(result.payload.allow).toBe('multipart/form-data')
  })
})
