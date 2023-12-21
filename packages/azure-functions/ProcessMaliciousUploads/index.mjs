import { blobStorageConnector } from '@defra/bng-connectors-lib'

const MALWARE_SCANNNING_RESULT_TAG_NAME = 'Malware Scanning scan result'
const MALWARE_SCANNNING_RESULT_TAG_VALUE = 'Malicious'

const containerName = 'customer-uploads'
const tags = `"${MALWARE_SCANNNING_RESULT_TAG_NAME}" = '${MALWARE_SCANNNING_RESULT_TAG_VALUE}'`
const config = {
  containerName,
  tags
}

let itemProcessingTimeout
let processingTimeout

export default async function (context, _timer) {
  context.log('Processing malicious uploads')
  let pauseProcessing = false
  // If all malicious ulploads are not processed within a configurable period of time,
  // pause processing unti the next scheduled invocation of this function.
  const timeoutId = setTimeout(() => { pauseProcessing = true }, getProcessingTimeout(context))
  for await (const maliciousUpload of await blobStorageConnector.findBlobsInContainerByTags(config)) {
    if (pauseProcessing) {
      // Let another invocation of this function continue processing malicious uploads
      break
    } else {
      await deleteMaliciousUpload(context, maliciousUpload)
    }
  }
  clearTimeoutIfNeeded(context, pauseProcessing, timeoutId)
}

const clearTimeoutIfNeeded = (context, pauseProcessing, timeoutId) => {
  if (pauseProcessing) {
    context.log('Malicious upload processing is paused until the next scheduled invocation of this function')
  } else {
    context.log('All malicious uploads have been processed')
    // Clear the timeout to pause processing as it is not required.
    clearTimeout(timeoutId)
  }
}

const deleteMaliciousUpload = async (context, maliciousUpload) => {
  const blobName = maliciousUpload.name
  const config = {
    containerName,
    blobName
  }

  context.log(`Deleting ${maliciousUpload.name}`)
  // Pause for a configurable period of time to avoid risking
  // blob storage calls being made too frequently.
  await new Promise(resolve => setTimeout(resolve, getItemProcessingTimeout(context)))
  return blobStorageConnector.deleteBlobIfExists(config)
}

const getTimeout = (context, environmentVariableName, defaultTimeoutMillis) => {
  try {
    if (isNaN(process.env[environmentVariableName])) {
      return defaultTimeoutMillis
    } else {
      // Use absolute values to guard against negative timeouts.
      return Math.abs(Number(process.env[environmentVariableName]))
    }
  } catch (err) {
    context.log.error(err)
    return defaultTimeoutMillis
  }
}

const getItemProcessingTimeout = context => {
  if (itemProcessingTimeout) {
    return itemProcessingTimeout
  } else {
    itemProcessingTimeout = getTimeout(context, 'MALICIOUS_UPLOAD_PROCESSING_PAUSE_MILLIS', 200)
    context.log(`Item processing timeout is ${itemProcessingTimeout}`)
    return itemProcessingTimeout
  }
}

const getProcessingTimeout = context => {
  if (processingTimeout) {
    return processingTimeout
  } else {
    processingTimeout = getTimeout(context, 'MALICIOUS_UPLOAD_PROCESSING_TIMEOUT_MILLIS', 10000)
    context.log(`Processing timeout is ${processingTimeout}`)
    return processingTimeout
  }
}
