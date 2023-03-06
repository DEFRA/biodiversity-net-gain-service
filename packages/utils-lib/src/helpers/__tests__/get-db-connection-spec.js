jest.mock('../db-config.js')
jest.mock('@azure/identity')
jest.mock('@defra/bng-connectors-lib')

describe('Database connection retrieval', () => {
  it('Should request DB access token if no password supplied for database', done => {
    jest.isolateModules(async () => {
      try {
        const dbConfig = require('../db-config.js')
        dbConfig.default = {
          host: process.env.POSTGRES_HOST,
          user: process.env.POSTGRES_USER,
          database: process.env.POSTGRES_DATABASE,
          port: process.env.POSTGRES_PORT,
          ssl: !!process.env.POSTGRES_SSL_MODE
        }
        const getDBConnection = require('../get-db-connection.js').default
        const { DefaultAzureCredential } = require('@azure/identity')
        DefaultAzureCredential.prototype.getToken = jest.fn().mockImplementation(() => {
          return {
            token: 'test'
          }
        })
        await getDBConnection()
        expect(DefaultAzureCredential.prototype.getToken.mock.calls).toHaveLength(1)
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should not request DB access token if password supplied for database', done => {
    jest.isolateModules(async () => {
      const dbConfig = require('../db-config.js')
      dbConfig.default = {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        port: process.env.POSTGRES_PORT,
        ssl: !!process.env.POSTGRES_SSL_MODE
      }
      try {
        const getDBConnection = require('../get-db-connection.js').default
        const { DefaultAzureCredential } = require('@azure/identity')
        DefaultAzureCredential.prototype.getToken = jest.fn().mockImplementation(() => {
          return {
            token: 'test'
          }
        })
        await getDBConnection()
        expect(DefaultAzureCredential.prototype.getToken.mock.calls).toHaveLength(0)
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})
