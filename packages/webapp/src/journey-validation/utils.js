import constants from '../utils/constants.js'
const ANY = 'any'

const routeDefinition = (startUrl, sessionKeys) => ({ startUrl, sessionKeys })

const journeyStep = (startUrl, sessionKeys, sessionValues, sessionMismatchWillInvalidate = false) => ({
  startUrl,
  sessionMismatchWillInvalidate,
  sessionDataRequired: Object.fromEntries(sessionKeys.map((_, i) => [sessionKeys[i], sessionValues[i]]))
})

const journeyStepFromRoute = (route, sessionValues = [ANY], sessionMismatchWillInvalidate = false) =>
  journeyStep(route.startUrl, route.sessionKeys, sessionValues, sessionMismatchWillInvalidate)

const taskItemFactory = (task, id) => {
  if (!task) {
    return {
      title: 'Check your answers and submit information',
      status: 'CANNOT START YET',
      url: constants.routes.CHECK_AND_SUBMIT,
      id
    }
  }

  return {
    title: task.title,
    status: task.status,
    url: task.url,
    id
  }
}

export {
  ANY,
  routeDefinition,
  journeyStep,
  journeyStepFromRoute,
  taskItemFactory
}
