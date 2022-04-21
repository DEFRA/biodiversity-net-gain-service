import Path from 'path'
import Nunjucks from 'nunjucks'
import Vision from '@hapi/vision'
import dirname from '../../dirname.cjs'

const serviceName = 'Register land for off-site biodiversity gain'

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
          options.compileOptions.environment = Nunjucks.configure(options.path, {
            autoescape: true,
            watch: false
          })

          return next()
        }
      }
    },
    path: [
      Path.join(dirname, 'public', 'build', 'views'),
      Path.join(dirname, 'src', 'views'),
      Path.join(dirname, 'node_modules', 'govuk-frontend')
    ],
    relativeTo: dirname,
    isCached: process.env.NODE_ENV !== 'development',
    context: {
      assetPath: '/public',
      serviceName,
      pageTitle: `${serviceName} - GOV.UK`
      // analyticsAccount: analyticsAccount
    }
  }
}

export default views
