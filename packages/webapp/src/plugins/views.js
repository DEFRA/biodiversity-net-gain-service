import Path from 'path'
import * as fs from 'fs'
import Nunjucks from 'nunjucks'
import Vision from '@hapi/vision'
import dirname from '../../dirname.cjs'
const serviceName = 'Register land as a biodiversity gain site'
const { version } = JSON.parse(fs.readFileSync('./package.json'))

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
      Path.join(dirname, 'node_modules', 'govuk-frontend'),
      Path.join(dirname, 'node_modules', '@ministryofjustice')
    ],
    relativeTo: dirname,
    isCached: process.env.NODE_ENV !== 'development',
    context: {
      serviceName,
      assetPath: '/public',
      pageTitle: `${serviceName} - GOV.UK`,
      titleSuffix: ' - GOV.UK',
      applicationVersion: version,
      googleTagmanagerID: process.env.GOOGLE_TAGMANAGER_ID,
      showCookieBanner: true
    }
  }
}

export default views
