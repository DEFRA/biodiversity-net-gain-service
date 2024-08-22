import dirname from '../../dirname.cjs'
import path from 'path'

const publicRoutes = [{
  method: 'GET',
  path: '/robots.txt',
  handler: {
    file: `${dirname}/public/static/robots.txt`
  },
  options: {
    auth: false
  }
}, {
  method: 'GET',
  path: '/public/{path*}',
  handler: {
    directory: {
      path: [
        path.join(dirname, 'public', 'static'),
        path.join(dirname, 'public', 'build'),
        path.join(dirname, '..', '..', 'node_modules', 'govuk-frontend', 'govuk'),
        path.join(dirname, '..', '..', 'node_modules', 'govuk-frontend', 'govuk', 'assets'),
        path.join(dirname, '..', '..', 'node_modules', 'jquery', 'dist')
      ]
    }
  },
  options: {
    auth: false
  }
}, {
  method: 'GET',
  path: '/public/moj/{path*}',
  handler: {
    directory: {
      path: [
        path.join(dirname, '..', '..', 'node_modules', '@ministryofjustice', 'frontend', 'moj'),
        path.join(dirname, '..', '..', 'node_modules', '@ministryofjustice', 'frontend', 'moj', 'assets')
      ]
    }
  },
  options: {
    auth: false
  }
}
]

export default publicRoutes
