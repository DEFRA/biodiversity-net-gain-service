import { logger } from 'defra-logging-facade'
import { signalRConnector } from '@defra/bng-connectors-lib'

const createPromiseForEvent = (connection, event) => {
  return new Promise((resolve, reject) => {
    // TO DO - Add error handling support.
    connection.on(event, async data => {
      resolve(data)
    })
  })
}

const createPromisesForEvents = (connection, events) => {
  const promises = []
  for (const event of events) {
    promises.push(createPromiseForEvent(connection, event))
  }
  return promises
}

const handleEvents = async (config, events) => {
  let eventData
  const connection = signalRConnector.createConnection(logger, config.signalRConfig.url)
  await connection.start()
  const promises = createPromisesForEvents(connection, events)
  try {
    eventData = await Promise.all(promises)
  } finally {
    await connection.stop()
  }
  return eventData
}

export { handleEvents }
