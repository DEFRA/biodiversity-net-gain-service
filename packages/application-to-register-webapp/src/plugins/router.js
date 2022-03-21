import aboutRoutes from '../routes/about.js'
import publicRoutes from '../routes/public.js'
import errorRoute from '../routes/error.js'
import startRoute from '../routes/start.js'

const routes = [].concat(
  aboutRoutes,
  publicRoutes,
  errorRoute,
  startRoute
)

const router = {
  name: 'router',
  register: server => { server.route(routes) }
}

export default router
