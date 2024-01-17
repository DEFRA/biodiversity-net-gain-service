const ANY = 'any'

const routeDefinition = (startUrl, sessionKeys) => ({ startUrl, sessionKeys })

const journeyStep = (startUrl, sessionKeys, sessionValues, sessionMismatchWillInvalidate = false) => ({
  startUrl,
  sessionMismatchWillInvalidate,
  sessionDataRequired: Object.fromEntries(sessionKeys.map((_, i) => [sessionKeys[i], sessionValues[i]]))
})

const journeyStepFromRoute = (route, sessionValues = [ANY], sessionMismatchWillInvalidate = false) =>
  journeyStep(route.startUrl, route.sessionKeys, sessionValues, sessionMismatchWillInvalidate)

export {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute
}
