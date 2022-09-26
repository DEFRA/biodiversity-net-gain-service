import { PostgreSqlContainer } from 'testcontainers'
import createDatabaseConfiguration from '../schema-init'
import path from 'path'

describe('Must ensure that database exist', () => {
  let instance
  let configuration
  beforeAll(async () => {
    instance = await new PostgreSqlContainer('postgres:11.11-alpine')
      .withDatabase('template1')
      .withPassword('secret')
      .withUser('postgres')
      .withTmpFs({ '/tmp': 'rw,noexec,nosuid' })
      .start()
    const workingDirectory = getWorkingDirectory()
    configuration = {
      user: instance.getUsername(),
      password: instance.getPassword(),
      host: instance.getHost(),
      port: instance.getPort(),
      database: 'Biodiversity_MVP',
      dbCreateFile: path.join(workingDirectory, '/src/dbscripts/bng_MVP_v_0.1_postgres.sql'),
      dbInsertFile: path.join(workingDirectory, './src/dbscripts/BNG_MVP_Postgres_Insert_V01.sql')
    }
  })

  it('should create database if it does not exist', async () => {
    const result = await createDatabaseConfiguration(configuration)
    expect(result).toEqual(true)
  })

  it('Should not create database if it exist', async () => {
    const result = await createDatabaseConfiguration(configuration)
    expect(result).toEqual(true)
  })

  const getWorkingDirectory = () => {
    let workingDirectory = process.cwd()
    if (workingDirectory.endsWith('gain-service')) {
      workingDirectory = path.join(workingDirectory, 'packages/database-lib')
    }
    return workingDirectory
  }
})
