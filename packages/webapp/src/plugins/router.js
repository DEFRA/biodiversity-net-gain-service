import constants from '../utils/constants.js'
import combinedCaseConstants from '../utils/combined-case-constants.js'

const router = async () => {
  const mainRoutes = [].concat(
    ...await Promise.all(Object.values(constants.routes).map(async route => (await import(`../routes/${route}.js`)).default))
  )

  const combinedCaseRoutes = combinedCaseConstants.routesToReuse.reduce((acc, routePath) => {
    const matchingRoutes = mainRoutes.filter(m => m.path === routePath)
    if (matchingRoutes.length) {
      const modifiedRoutes = matchingRoutes.map(originalRoute => {
        const pathParts = originalRoute.path.split('/')
        const page = pathParts[pathParts.length - 1]
        return {
          ...originalRoute,
          path: `${combinedCaseConstants.baseUrl}/${page}`
        }
      })
      return [...acc, ...modifiedRoutes]
    }
    return acc
  }, [])

  const routes = [...mainRoutes, ...combinedCaseRoutes]

  return {
    name: 'router',
    register: server => { server.route(routes) }
  }
}
export default router
