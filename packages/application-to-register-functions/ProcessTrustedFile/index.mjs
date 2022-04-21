export default async function (context, message) {
  context.log('Processing', JSON.stringify(message))
  let processingFunction
  try {
    // Load the processing function for the upload type.
    processingFunction = (await import(`./helpers/process-${message.uploadType}.js`)).default
  } catch (err) {
    // If the processing function cannot be loaded message replay should not be attempted.
    context.err(`Unable to load processing function for upload type ${message}.uploadType - ${err.message}`)
  }
  await processingFunction(context, message.location)
}
