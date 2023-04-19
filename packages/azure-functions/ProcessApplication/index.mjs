import { getDBConnection } from '@defra/bng-utils-lib'
import { createApplicationReference, deleteApplicationSession } from '../Shared/db-queries.js'

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
    db = await getDBConnection()
    if (!req.body.landownerGainSiteRegistration.gainSiteReference) {
      const applicationReference = await createApplicationReference(db)
      req.body.landownerGainSiteRegistration.gainSiteReference = applicationReference.rows[0].fn_create_application_reference
    } else {
      // Clear out saved application (reference was generated from saving)
      await deleteApplicationSession(db, [req.body.landownerGainSiteRegistration.gainSiteReference])
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
