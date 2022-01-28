import homeRoutes from '../routes/home.js'
import aboutRoutes from '../routes/about.js'
import publicRoutes from '../routes/public.js'
import errorRoute from '../routes/error.js'

const routes = [].concat(
  homeRoutes,
  aboutRoutes,
  publicRoutes,
  errorRoute
)

const router = {
  name: 'router',
  register: server => { server.route(routes) }
}

export default router
