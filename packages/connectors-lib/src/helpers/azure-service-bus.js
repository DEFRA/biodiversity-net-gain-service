import { ServiceBusClient } from '@azure/service-bus'

const getServiceBusClient = (connectionString) => {
  const initialiseServiceBusClient = () => {
    return new ServiceBusClient(connectionString)
  }

  return initialiseServiceBusClient()
}

export { getServiceBusClient }
