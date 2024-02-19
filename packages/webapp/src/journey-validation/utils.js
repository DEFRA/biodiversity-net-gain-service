const ANY = 'any'

const routeDefinition = (startUrl, sessionKeys) => ({ startUrl, sessionKeys })

const journeyStep = (startUrl, sessionKeys, sessionValues, sessionMismatchWillInvalidate = false) => ({
  startUrl,
  sessionMismatchWillInvalidate,
  sessionDataRequired: Object.fromEntries(sessionKeys.map((_, i) => [sessionKeys[i], sessionValues[i]]))
})

const journeyStepFromRoute = (route, sessionValues = [ANY], sessionMismatchWillInvalidate = false) =>
  journeyStep(route.startUrl, route.sessionKeys, sessionValues, sessionMismatchWillInvalidate)

// FIXME: we should be able to get the startUrl and completeURL from the journeyParts
const taskDefinition = (id, title, startUrl, completeUrl, journeyParts) => ({
  id, title, startUrl, completeUrl, journeyParts
})

const taskSectionDefinition = (title, tasks) => ({ title, tasks })

export {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute,
  taskDefinition,
  taskSectionDefinition
}
