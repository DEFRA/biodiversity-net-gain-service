import { ServiceBusClient } from '@azure/service-bus'

const getServiceBusClient = connectionString => {
  const initialiseServiceBusClient = () => new ServiceBusClient(connectionString)
  return initialiseServiceBusClient()
}

export { getServiceBusClient }
