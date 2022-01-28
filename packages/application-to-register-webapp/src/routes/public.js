const publicRoutes = [{
  method: 'GET',
  path: '/robots.txt',
  handler: {
    file: 'src/public/static/robots.txt'
  }
}, {
  method: 'GET',
  path: '/assets/all.js',
  handler: {
    file: 'node_modules/govuk-frontend/govuk/all.js'
  }
}, {
  method: 'GET',
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: [
        'src/public/static',
        'src/public/build',
        'node_modules/govuk-frontend/govuk/assets'
      ]
    }
  }
}]

export default publicRoutes
