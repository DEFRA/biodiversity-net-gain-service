import { Client } from 'pg'
import createDatabaseConfiguration from '../schema-init'
import path from 'path'

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn()
  }
  return { Client: jest.fn(() => mClient) }
})

const getWorkingDirectory = () => {
  let workingDirectory = process.cwd()
  if (workingDirectory.endsWith('gain-service')) {
    workingDirectory = path.join(workingDirectory, 'packages/database-lib')
  }
  return workingDirectory
}

const workingDirectory = getWorkingDirectory()

const configuration = {
  database: 'Biodiversity_MVP',
  dbCreateFile: path.join(workingDirectory, '/src/dbscripts/bng_MVP_v_0.1_postgres.sql'),
  dbInsertFile: path.join(workingDirectory, './src/dbscripts/BNG_MVP_Postgres_Insert_V01.sql'),
  initialise: true
}

describe('Must ensure that database exist', () => {
  let client

  beforeEach(() => {
    client = new Client()
  })

  afterEach(() => {
    client = undefined
    jest.clearAllMocks()
  })

  it('Should create database if it does not exist', async () => {
    const result = await createDatabaseConfiguration(client, configuration)

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith('CREATE DATABASE "Biodiversity_MVP"')
    expect(result).toBe(true)
  })

  it('Should not create database if it already exist', async () => {
    client.query = jest.fn().mockImplementation(() => {
      throw new Error()
    })

    const result = await createDatabaseConfiguration(client, configuration)

    expect(client.connect).toBeCalledTimes(1)
    expect(result).toBe(true)
  })

  it('Should fail to connect to database', async () => {
    client.connect = jest.fn().mockImplementation(() => {
      throw new Error()
    })

    const result = await createDatabaseConfiguration(client, configuration)

    expect(client.connect).toBeCalledTimes(1)
    expect(result).toBe(false)
  })
})
