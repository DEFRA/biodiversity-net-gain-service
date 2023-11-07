export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))

  let processingFunction
  try {
    processingFunction = (await import(`./helpers/process-${req.body.uploadType}.js`)).default
    const result = await processingFunction(context, req.body)
    context.res = {
      status: 200,
      body: JSON.stringify(result)
    }
    context.log('Processed', JSON.stringify(req.body))
  } catch (err) {
    // If the processing function cannot be loaded message replay should not be attempted.
    context.log.error(`Unable to load processing function for upload type ${JSON.stringify(req.body)}.uploadType - ${err.message}`)
    context.log.error(err)
    context.res = {
      status: 400,
      body: {
        code: 'UNKNOWN-UPLOAD-TYPE',
        uploadType: req.body.uploadType
      }
    }
  }
}