export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  const signalRMessage = {
    userId: 'Test',
    target: `Processed ${message}`
  }

  switch (message) {
    case 'success':
      signalRMessage.arguments = [{ mock: 'data' }]
      break
    case 'failure with authority key':
      signalRMessage.arguments = [{
        authorityKey: 'mockAuthorityKey',
        errorCode: 'failure'
      }]
      break
    case 'failure with upload type':
      signalRMessage.arguments = [{
        uploadType: 'mockUploadType',
        errorCode: 'failure'
      }]
      break
    case 'failure with error code':
      signalRMessage.arguments = [{ errorCode: 'failure' }]
      break
    case 'failure with error message':
      signalRMessage.arguments = [{ errorMessage: 'failure' }]
      break
  }

  context.bindings.signalRMessages = [signalRMessage]
  context.log(JSON.stringify(context.bindings.signalRMessages))
}
