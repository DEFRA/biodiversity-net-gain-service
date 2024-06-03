const ANY = 'any'

const routeDefinition = (startUrl, sessionKeys, nextUrl) => ({ startUrl, sessionKeys, nextUrl })

const journeyStep = (startUrl, sessionKeys, sessionValues, sessionMismatchWillInvalidate = false, nextUrl = null) => ({
  startUrl,
  sessionMismatchWillInvalidate,
  sessionDataRequired: Object.fromEntries(sessionKeys.map((_, i) => [sessionKeys[i], sessionValues[i]])),
  nextUrl
})

const journeyStepFromRoute = (route, sessionValues = [ANY], sessionMismatchWillInvalidate = false) =>
  journeyStep(route.startUrl, route.sessionKeys, sessionValues, sessionMismatchWillInvalidate, route?.nextUrl)

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
