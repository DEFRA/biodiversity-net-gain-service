import { processErrorUpload, buildErrorResponse, maximumFileSizeExceeded } from '../upload-error-handler.js'
import constants from '../constants.js'
import { getMaximumFileSizeExceededView } from '../helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

jest.mock('../helpers.js')

describe('upload-error-handler', () => {
  const h = {
    view: jest.fn()
  }
  const href = '/test'
  const maximumFileSize = 50
  const view = 'test-view'

  beforeEach(() => {
    h.view.mockClear()
    getMaximumFileSizeExceededView.mockClear()
  })

  describe('processErrorUpload', () => {
    it('should handle maximumFileSizeExceeded error', () => {
      const err = new Error(constants.uploadErrors.maximumFileSizeExceeded)
      processErrorUpload({ err, h, href, maximumFileSize })
      expect(h.view).toHaveBeenCalledWith(href, {
        err: [{
          text: `The selected file must not be larger than ${maximumFileSize}MB`,
          href
        }]
      })
    })

    it('should handle emptyFile error', () => {
      const err = new Error(constants.uploadErrors.emptyFile)
      processErrorUpload({ err, h, href, maximumFileSize })
      expect(h.view).toHaveBeenCalledWith(href, {
        err: [{
          text: 'The selected file is empty',
          href
        }]
      })
    })

    it('should handle noFile error', () => {
      const err = new Error(constants.uploadErrors.noFile)
      const noFileErrorMessage = 'No file was selected'
      processErrorUpload({ err, h, href, noFileErrorMessage, maximumFileSize })
      expect(h.view).toHaveBeenCalledWith(href, {
        err: [{
          text: noFileErrorMessage,
          href
        }]
      })
    })

    it('should handle unsupportedFileExt error', () => {
      const err = new Error(constants.uploadErrors.unsupportedFileExt)
      const unsupportedFileExtErrorMessage = 'The selected file must be a DOC, DOCX or PDF'
      processErrorUpload({ err, h, href, unsupportedFileExtErrorMessage, maximumFileSize })
      expect(h.view).toHaveBeenCalledWith(href, {
        err: [{
          text: unsupportedFileExtErrorMessage,
          href
        }]
      })
    })

    it('should handle notValidMetric error', () => {
      const err = new Error(constants.uploadErrors.notValidMetric)
      processErrorUpload({ err, h, href, maximumFileSize })
      expect(h.view).toHaveBeenCalledWith(href, {
        err: [{
          text: 'The selected file is not a valid Metric',
          href
        }]
      })
    })

    it('should handle ThreatScreeningError', () => {
      const err = new ThreatScreeningError()
      processErrorUpload({ err, h, href, maximumFileSize })
      expect(h.view).toHaveBeenCalledWith(href, {
        err: [{
          text: constants.uploadErrors.malwareScanFailed,
          href
        }]
      })
    })
    it('should handle MalwareDetectedError', () => {
      const err = new MalwareDetectedError()
      processErrorUpload({ err, h, href, maximumFileSize })
      expect(h.view).toHaveBeenCalledWith(href, {
        err: [{
          text: constants.uploadErrors.threatDetected,
          href
        }]
      })
    })
  })

  describe('buildErrorResponse', () => {
    it('should build error response', () => {
      const message = 'Test error message'
      buildErrorResponse(h, message, href)
      expect(h.view).toHaveBeenCalledWith(href, {
        err: [{
          text: message,
          href
        }]
      })
    })
  })

  describe('maximumFileSizeExceeded', () => {
    it('should call getMaximumFileSizeExceededView', () => {
      maximumFileSizeExceeded(h, href, maximumFileSize, view)
      expect(getMaximumFileSizeExceededView).toHaveBeenCalledWith({
        h,
        href,
        maximumFileSize,
        view
      })
    })
  })
})
