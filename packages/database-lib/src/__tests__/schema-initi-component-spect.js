import createDatabaseConfiguration from '../schema-init'
import path from 'path'

describe('Must ensure that database exist', () => {
  let configuration
  beforeAll(async () => {
    const workingDirectory = getWorkingDirectory()
    configuration = {
      user: 'postgres',
      password: 'postgres',
      host: '217.0.0.1',
      port: 5432,
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
