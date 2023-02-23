import getDBConnection from '../Shared/get-db-connection.js'
import { createApplicationReference } from '../Shared/db-queries.js'

const buildConfig = body => {
  return {
    serviceBusConfig: {
      queueName: 'ne.bng.landowner.inbound',
      message: body
    },
    res: {
      gainSiteReference: body.landownerGainSiteRegistration.gainSiteReference
    }
  }
}

export default async function (context, req) {
  context.log('Processing', JSON.stringify(req.body))
  let db
  try {
    // Generate gain site reference if not already present
    if (!req.body.landownerGainSiteRegistration.gainSiteReference) {
      db = await getDBConnection()
      const applicationReference = await createApplicationReference(db)
      req.body.landownerGainSiteRegistration.gainSiteReference = applicationReference.rows[0].fn_create_application_reference
    }
    const config = buildConfig(req.body)
    context.bindings.outputSbQueue = config.serviceBusConfig.message
    context.res = {
      status: 200,
      body: JSON.stringify(config.res)
    }
    context.log(`Processed ${req.body.landownerGainSiteRegistration.gainSiteReference}`)
  } catch (err) {
    context.log.error(err)
    context.res = {
      status: 400,
      body: JSON.stringify(err)
    }
  } finally {
    await db?.end()
  }
}
