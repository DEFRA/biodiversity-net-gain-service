import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

const createConnection = (_logger, url) => {
  return new HubConnectionBuilder()
    .withUrl(url)
    .configureLogging(LogLevel.Warning)
    .build()
}

export const signalRConnector = Object.freeze({
  createConnection
})
