import { ServiceBusClient } from '@azure/service-bus'
let getServiceBusClient
// If no connection string don't initialise
if (process.env.AZURE_SERVICE_BUS_CONNECTION_STRING) {
  const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING

  const initialiseServiceBusClient = () => {
    return new ServiceBusClient(connectionString)
  }

  const serviceBusClient = initialiseServiceBusClient()

  getServiceBusClient = () => serviceBusClient

} else {
  getServiceBusClient = () => {}
}

export { getServiceBusClient }
