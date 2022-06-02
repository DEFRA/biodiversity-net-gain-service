export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  context.bindings.signalRMessages = [{
    userId: 'Test',
    target: 'Test event',
    arguments: [{ mock: 'data' }]
  }]
}
