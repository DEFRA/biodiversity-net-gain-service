import { postgresConnector } from '@defra/bng-connectors-lib'
import { DefaultAzureCredential } from '@azure/identity'
import DbConfig from './db-config.js'

const getDBConnection = async () => {
  // Clone so that we don't store the token (which will expire)
  const dbConfig = JSON.parse(JSON.stringify(DbConfig))
  if (!dbConfig.password) {
    const credential = new DefaultAzureCredential()
    dbConfig.password = (await credential.getToken('https://ossrdbms-aad.database.windows.net')).token
  }
  return new postgresConnector.Db(dbConfig)
}

export default getDBConnection
