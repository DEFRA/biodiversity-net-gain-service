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

          return (context) => {
            return template.render(context)
          }
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
    relativeTo: process.cwd().indexOf('packages/web') > -1 ? process.cwd() : Path.join(process.cwd(), 'packages/web'),
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
