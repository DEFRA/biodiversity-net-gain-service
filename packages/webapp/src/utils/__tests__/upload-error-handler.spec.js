import { processErrorUpload, buildErrorResponse, maximumFileSizeExceeded } from '../upload-error-handler.js'
import constants from '../constants.js'
import { getMaximumFileSizeExceededView } from '../helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

jest.mock('../helpers.js')

describe('upload-error-handler', () => {
  const h = {
    view: jest.fn(),
    redirectView: jest.fn()
  }
  const route = '/test'
  const elementID = '#test'
  const maximumFileSize = 50
  const view = 'test-view'

  beforeEach(() => {
    h.redirectView.mockClear()
    getMaximumFileSizeExceededView.mockClear()
  })

  describe('processErrorUpload', () => {
    it('should handle maximumFileSizeExceeded error', () => {
      const err = new Error(constants.uploadErrors.maximumFileSizeExceeded)
      processErrorUpload({ err, h, route, elementID, maximumFileSize })
      expect(h.redirectView).toHaveBeenCalledWith(route, {
        err: [{
          text: `The selected file must not be larger than ${maximumFileSize}MB`,
          href: elementID
        }]
      })
    })

    it('should handle emptyFile error', () => {
      const err = new Error(constants.uploadErrors.emptyFile)
      processErrorUpload({ err, h, route, elementID, maximumFileSize })
      expect(h.redirectView).toHaveBeenCalledWith(route, {
        err: [{
          text: 'The selected file is empty',
          href: elementID
        }]
      })
    })

    it('should handle noFile error', () => {
      const err = new Error(constants.uploadErrors.noFile)
      const noFileErrorMessage = 'No file was selected'
      processErrorUpload({ err, h, route, elementID, noFileErrorMessage, maximumFileSize })
      expect(h.redirectView).toHaveBeenCalledWith(route, {
        err: [{
          text: noFileErrorMessage,
          href: elementID
        }]
      })
    })

    it('should handle unsupportedFileExt error', () => {
      const err = new Error(constants.uploadErrors.unsupportedFileExt)
      const unsupportedFileExtErrorMessage = 'The selected file must be a DOC, DOCX or PDF'
      processErrorUpload({ err, h, route, elementID, unsupportedFileExtErrorMessage, maximumFileSize })
      expect(h.redirectView).toHaveBeenCalledWith(route, {
        err: [{
          text: unsupportedFileExtErrorMessage,
          href: elementID
        }]
      })
    })

    it('should handle notValidMetric error', () => {
      const err = new Error(constants.uploadErrors.notValidMetric)
      processErrorUpload({ err, h, route, elementID, maximumFileSize })
      expect(h.redirectView).toHaveBeenCalledWith(route, {
        err: [{
          text: 'The selected file is not a valid Metric',
          href: elementID
        }]
      })
    })

    it('should handle ThreatScreeningError', () => {
      const err = new ThreatScreeningError()
      processErrorUpload({ err, h, route, elementID, maximumFileSize })
      expect(h.redirectView).toHaveBeenCalledWith(route, {
        err: [{
          text: constants.uploadErrors.malwareScanFailed,
          href: elementID
        }]
      })
    })
    it('should handle MalwareDetectedError', () => {
      const err = new MalwareDetectedError()
      processErrorUpload({ err, h, route, elementID, maximumFileSize })
      expect(h.redirectView).toHaveBeenCalledWith(route, {
        err: [{
          text: constants.uploadErrors.threatDetected,
          href: elementID
        }]
      })
    })
  })

  describe('buildErrorResponse', () => {
    it('should build error response', () => {
      const message = 'Test error message'
      buildErrorResponse(h, message, route, elementID)
      expect(h.redirectView).toHaveBeenCalledWith(route, {
        err: [{
          text: message,
          href: elementID
        }]
      })
    })
  })

  describe('maximumFileSizeExceeded', () => {
    it('should call getMaximumFileSizeExceededView', () => {
      maximumFileSizeExceeded(h, route, maximumFileSize, view)
      expect(getMaximumFileSizeExceededView).toHaveBeenCalledWith({
        h,
        href: route,
        maximumFileSize,
        view
      })
    })
  })
})
