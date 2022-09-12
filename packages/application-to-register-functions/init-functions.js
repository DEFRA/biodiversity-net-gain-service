// This script switches a function triggers/outs to use either service Bus or storage queues depending on configuration
import * as fs from 'fs'

const settings = JSON.parse(fs.readFileSync('./local.settings.json'))
const processUntrustedFile = JSON.parse(fs.readFileSync('./ProcessUntrustedFile/function.template.json'))
const processTrustedFile = JSON.parse(fs.readFileSync('./ProcessTrustedFile/function.template.json'))

if (settings.Values.AzureWebJobsServiceBus) {
  // Use ServiceBus triggers
  console.log('Service Bus will trigger functions')
  processUntrustedFile.bindings = processUntrustedFile.bindings.filter((item) => item.name !== 'storageQueueTrigger')
  processTrustedFile.bindings = processTrustedFile.bindings.filter((item) => item.name !== 'storageQueueTrigger')
} else {
  // Use Storage queue triggers
  console.log('Storage Queues will trigger functions')
  processUntrustedFile.bindings = processUntrustedFile.bindings.filter((item) => item.name !== 'serviceBusTrigger')
  processTrustedFile.bindings = processTrustedFile.bindings.filter((item) => item.name !== 'serviceBusTrigger')
}

fs.writeFileSync('./ProcessUntrustedFile/function.json', JSON.stringify(processUntrustedFile))
fs.writeFileSync('./ProcessTrustedFile/function.json', JSON.stringify(processTrustedFile))
