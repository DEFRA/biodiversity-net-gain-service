import constants from '../utils/constants.js'
import { baseUrl as combinedCaseBaseUrl, reusedRoutes as combinedCaseReusedRoutes } from '../utils/combined-case-constants.js'

const router = async () => {
  const mainRoutes = [].concat(
    ...await Promise.all(Object.values(constants.routes).map(async route => (await import(`../routes/${route}.js`)).default))
  )

  const combinedCaseRoutes = [...combinedCaseReusedRoutes].map(routePath => {
    const originalRoute = mainRoutes.find(m => m.path === routePath)
    if (originalRoute) {
      const pathParts = originalRoute.path.split('/')
      const page = pathParts[pathParts.length - 1]
      return {
        ...originalRoute, ...{ path: `${combinedCaseBaseUrl}/${page}` }
      }
    }
    return null
  }).filter(route => route !== null)

  const routes = [...mainRoutes, ...combinedCaseRoutes]

  return {
    name: 'router',
    register: server => { server.route(routes) }
  }
}
export default router
