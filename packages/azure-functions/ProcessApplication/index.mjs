import { postgresConnector } from '@defra/bng-connectors-lib'
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
  try {
    // Generate gain site reference if not already present
    if (!req.body.landownerGainSiteRegistration.gainSiteReference) {
      const db = new postgresConnector.Db(process.env.POSTGRES_CONNECTION_STRING)
      const applicationReference = await createApplicationReference(db)
      req.body.landownerGainSiteRegistration.gainSiteReference = applicationReference.rows[0].fn_create_application_reference
      await db.end()
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
  }
}
