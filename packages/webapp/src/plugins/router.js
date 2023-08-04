import constants from '../utils/constants.js'
import { getDisabledRoutes } from '../utils/helpers.js'

const router = async () => {
  let routes = [].concat(
    ...await Promise.all(Object.values(constants.routes).map(async route => (await import(`../routes/${route}.js`)).default))
  )

  // Disabling some routes from the registration journey for MVP
  const disabledRoutes = getDisabledRoutes()
  if (disabledRoutes.length > 0) {
    routes = routes.filter(route => !disabledRoutes.includes(route?.path))
  }

  return {
    name: 'router',
    register: server => { server.route(routes) }
  }
}
export default router
