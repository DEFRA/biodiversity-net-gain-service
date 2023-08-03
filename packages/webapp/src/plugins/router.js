import constants from '../utils/constants.js'

// Disabling some routes from the registration journey for MVP
const routesToBeExcluded = [
  '/land/choose-land-boundary-upload',
  '/land/geospatial-land-boundary',
  '/land/check-geospatial-file', // NOTE: Need to revise AC of 3402
  '/land/download-geospatial-land-boundary-file'
]

const router = async () => {
  let routes = [].concat(
    ...await Promise.all(Object.values(constants.routes).map(async route => (await import(`../routes/${route}.js`)).default))
  )

  if (process.env.HAS_ROUTES_DISABLED === 'true') {
    routes = routes.filter(route => !routesToBeExcluded.includes(route?.path))
  }

  return {
    name: 'router',
    register: server => { server.route(routes) }
  }
}
export default router
