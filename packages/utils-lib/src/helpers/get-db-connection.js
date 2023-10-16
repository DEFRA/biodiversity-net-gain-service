import { postgresConnector } from '@defra/bng-connectors-lib'
import { DefaultAzureCredential } from '@azure/identity'
import DbConfig from './db-config.js'
import { logger } from 'defra-logging-facade'

const getDBConnection = async () => {
  // Clone so that we don't store the token (which will expire)
  const dbConfig = JSON.parse(JSON.stringify(DbConfig))
  logger.info('getDBConnection')
  logger.info(dbConfig)
  if (!dbConfig.password) {
    const credential = new DefaultAzureCredential()
    logger.info('Getting database token')
    dbConfig.password = (await credential.getToken('https://ossrdbms-aad.database.windows.net')).token
  }
  return new postgresConnector.Db(dbConfig)
}

export default getDBConnection
