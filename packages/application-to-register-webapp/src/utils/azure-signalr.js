import { logger } from 'defra-logging-facade'
import { signalRConnector } from '@defra/bng-connectors-lib'

const createPromiseForEvent = (connection, event, config) => {
  let timeoutId
  const eventPromise = new Promise((resolve, reject) => {
    connection.on(event, async data => {
      try {
        config.eventProcessingFunction(data)
        resolve(data)
      } catch (err) {
        reject(err)
      } finally {
        clearTimeout(timeoutId)
      }
    })
  })

  // eslint-disable-next-line
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${event} timed out`))
    }, config.timeout || 30000)
  })

  return Promise.race([eventPromise, timeoutPromise])
}

const createPromisesForEvents = (connection, events, config) => {
  const promises = []
  for (const event of events) {
    promises.push(createPromiseForEvent(connection, event, config))
  }
  return promises
}

const handleEvents = async (config, events) => {
  let eventData
  const connection = signalRConnector.createConnection(logger, config.signalRConfig.url)
  await connection.start()
  const promises = createPromisesForEvents(connection, events, config.signalRConfig)
  try {
    eventData = await Promise.all(promises)
  } finally {
    await connection.stop()
  }
  return eventData
}

export { handleEvents }
