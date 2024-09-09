/**
 * Plugin to check for journey-start-section-id query param. If present, it stores its value then redirects to the page
 * without the query params. We use this to identify if the user came from a specific section on check and submit.
*/

export default {
  plugin: {
    name: 'section-id-handler',

    register: (server, _options) => {
      server.ext('onPreResponse', (request, h) => {
        if (!request.query['journey-start-section-id']) {
          return h.continue
        }

        console.log('journey-start-section-id:', request.query['journey-start-section-id'])

        const url = new URL(request.url)
        url.searchParams.delete('journey-start-section-id')
        return h.redirect(url.toString())
      })
    }
  }
}
