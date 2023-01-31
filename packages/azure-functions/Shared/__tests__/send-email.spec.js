import sendEmail from '../send-email.js'

jest.mock('notifications-node-client')

describe('Email sending', () => {
  const baseConfig = {
    templateId: 'mockTemplateId',
    emailAddress: 'mockEmailAddress',
    personalisation: {
      full_name: 'mockFullName',
      reg_number: 'mockRegNumber',
      continue_registration: 'mockRegistrationNumber'
    }
  }
  const errorMessage = 'Unable to send email'

  it('Should call the notifications-node-client and return the data value of the response', done => {
    jest.isolateModules(async () => {
      const mockResponseData = {
        data: {
          mock: {}
        }
      }
      const NotifyClient = require('notifications-node-client').NotifyClient
      NotifyClient.prototype.sendEmail.mockReturnValueOnce(mockResponseData)
      try {
        await expect(sendEmail(baseConfig)).resolves.toStrictEqual(mockResponseData.data)
        expect(NotifyClient.prototype.sendEmail).toHaveBeenCalledTimes(1)
        expect(NotifyClient.prototype.sendEmail).toHaveBeenCalledWith(
          baseConfig.templateId,
          baseConfig.emailAddress,
          {
            personalisation: baseConfig.personalisation,
            reference: null,
            emailReplyToId: null
          }
        )
        done()
      } catch (err) {
        done(err)
      }
    })
  })
  it('Should return the cause of an error if present', done => {
    jest.isolateModules(async () => {
      const mockErrorResponseData = {
        response: {
          data: {
            errors: [
              {
                error: 'MockError',
                message: 'mock error message'
              }
            ]
          }
        }
      }

      const expectedError = new Error(errorMessage, { cause: mockErrorResponseData.response.data })

      const NotifyClient = require('notifications-node-client').NotifyClient
      NotifyClient.prototype.sendEmail.mockRejectedValueOnce(mockErrorResponseData)
      try {
        await expect(sendEmail(baseConfig)).rejects.toEqual(expectedError)
        expect(NotifyClient.prototype.sendEmail).toHaveBeenCalledTimes(1)
        expect(NotifyClient.prototype.sendEmail).toHaveBeenCalledWith(
          baseConfig.templateId,
          baseConfig.emailAddress,
          {
            personalisation: baseConfig.personalisation,
            reference: null,
            emailReplyToId: null
          }
        )
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
