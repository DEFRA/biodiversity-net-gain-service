import { setup as _setup, defaultClient } from 'applicationinsights'

function setup () {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    _setup().start()
    console.log('App Insights Running')
    const cloudRoleTag = defaultClient.context.keys.cloudRole
    const appName = process.env.APPINSIGHTS_CLOUDROLE
    defaultClient.context.tags[cloudRoleTag] = appName
  } else {
    console.log('App Insights Not Running!')
  }
}

function logException (request, event) {
  try {
    const client = defaultClient
    client?.trackException({
      exception: event.error ?? new Error('unknown'),
      properties: {
        statusCode: request ? request.statusCode : '',
        sessionId: request ? request.yar?.id : '',
        payload: request ? request.payload : '',
        request: event.request ?? 'Server Error'
      }
    })
  } catch (err) {
    console.error(err, 'App Insights')
  }
}
export { setup, logException }
