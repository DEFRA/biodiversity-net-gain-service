import { NotifyClient } from 'notifications-node-client'
const notifyClient = new NotifyClient(process.env.NOTIFY_CLIENT_API_KEY)

const sendEmail = async config => {
  let response
  const { personalisation, reference, emailReplyToId } = config
  try {
    response =
      await notifyClient.sendEmail(
        config.templateId,
        config.emailAddress,
        {
          personalisation,
          reference: reference || null,
          emailReplyToId: emailReplyToId || null
        }
      )
    return response.data
  } catch (err) {
    const errorMessage = 'Unable to send email'
    if (err?.response?.data?.errors) {
      throw new Error(errorMessage, { cause: err.response.data.errors[0] })
    } else {
      throw new Error(errorMessage, { cause: err })
    }
  }
}

export default sendEmail
