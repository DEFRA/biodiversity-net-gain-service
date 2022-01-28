import Path from 'path'
import Nunjucks from 'nunjucks'
import Vision from '@hapi/vision'

const views = {
  plugin: Vision,
  options: {
    engines: {
      html: {
        compile: (src, options) => {
          const template = Nunjucks.compile(src, options.environment)

          return context => template.render(context)
        },
        prepare: (options, next) => {
          options.compileOptions.environment = Nunjucks.configure([
            Path.join(options.relativeTo, options.path),
            Path.join(options.relativeTo, 'node_modules/govuk-frontend/')
          ], {
            autoescape: true,
            watch: false
          })

          return next()
        }
      }
    },
    path: './src/views',
    // We need to handle tests running from root of repository, instead of root of the node application
    relativeTo: process.cwd().indexOf('packages/application-to-register-webapp') > -1 ? process.cwd() : Path.join(process.cwd(), 'packages/application-to-register-webapp'),
    isCached: true,
    context: {
      assetPath: '/assets',
      serviceName: 'Biodiversity Net Gains',
      pageTitle: 'Biodiversity Net Gains - GOV.UK'
      // analyticsAccount: analyticsAccount
    }
  }
}

export default views
