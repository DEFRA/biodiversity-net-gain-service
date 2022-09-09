import { ServiceBusClient } from '@azure/service-bus'

const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING

const initialiseServiceBusClient = () => {
  return new ServiceBusClient(connectionString)
}

const serviceBusClient = initialiseServiceBusClient()

const getServiceBusClient = () => serviceBusClient

export { getServiceBusClient }
