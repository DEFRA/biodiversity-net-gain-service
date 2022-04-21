import signalR from '@microsoft/signalr'

const createConnection = (logger, url) => {
  const connection =
    new signalR.HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(signalR.LogLevel.Warning)
      .build()

  return connection
}

export const signalRConnector = Object.freeze({
  createConnection
})
