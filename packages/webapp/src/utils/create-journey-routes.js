const replacePath = (routes, targetPath) => {
  const targetRoutes = cloneRoutes(routes)
  for (const targetRoute of targetRoutes) {
    targetRoute.path = targetPath
  }
  return targetRoutes
}

const cloneRoutes = routes => {
  const clonedRoutes = JSON.parse(JSON.stringify(routes))
  // Copy the handlers manually.
  for (const index in clonedRoutes) {
    clonedRoutes[index].handler = routes[index].handler
  }
  return clonedRoutes
}

const createAdditionalRoutesIfRequired = (registrationRoutes, environmentVariableName, targetPath) => {
  let additionalRoutes = []
  // Only create additional routes if the journey uses them and the journey type is enabled.
  if (targetPath && process.env[environmentVariableName] === 'Y') {
    additionalRoutes = replacePath(registrationRoutes, targetPath)
  }
  return additionalRoutes
}

export default (registrationRoutes, additionalRoutePaths) => {
  const allocationRoutes =
    createAdditionalRoutesIfRequired(registrationRoutes, 'ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY', additionalRoutePaths.allocationRoutePath)
  const creditsEstimationRoutes =
    createAdditionalRoutesIfRequired(registrationRoutes, 'ENABLE_ROUTE_SUPPORT_FOR_CREDIT_ESTIMATION_JOURNEY', additionalRoutePaths.creditsEstimationRoutePath)

  return registrationRoutes.concat(allocationRoutes).concat(creditsEstimationRoutes)
}
