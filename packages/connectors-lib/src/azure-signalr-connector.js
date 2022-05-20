import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

const createConnection = (logger, url) => {
  const connection =
    new HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(LogLevel.Warning)
      .build()

  return connection
}

export const signalRConnector = Object.freeze({
  createConnection
})
