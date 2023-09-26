import dirname from '../../dirname.cjs'

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
        `${dirname}/public/static`,
        `${dirname}/public/build`,
        `${dirname}/node_modules/govuk-frontend/govuk`,
        `${dirname}/node_modules/govuk-frontend/govuk/assets`,
        `${dirname}/node_modules/jquery/dist`
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
        `${dirname}/node_modules/@ministryofjustice/frontend/moj`,
        `${dirname}/node_modules/@ministryofjustice/frontend/moj/assets`
      ]
    }
  },
  options: {
    auth: false
  }
}
]

export default publicRoutes
