import { getContext, getTimer } from '../../.jest/setup.js'
import clearApplicationSession from '../index.mjs'

jest.mock('@defra/bng-connectors-lib')
jest.mock('../../Shared/db-queries.js')

describe('clearApplicationSession', () => {
  it('Should call database clear function', async () => {
    const dbQueries = require('../../Shared/db-queries.js')
    dbQueries.clearApplicationSession = jest.fn().mockImplementation(() => {})
    await clearApplicationSession(getContext(), getTimer())
    expect(dbQueries.clearApplicationSession.mock.calls).toHaveLength(1)
  })
})
