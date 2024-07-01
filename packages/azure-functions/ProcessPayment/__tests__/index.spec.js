import processPayment from '../index.mjs'
import { getDBConnection } from '@defra/bng-utils-lib'
import {
  getApplicationPayment,
  insertApplicationPayment
} from '../../Shared/db-queries.js'

jest.mock('@defra/bng-utils-lib')
jest.mock('../../Shared/db-queries.js')

describe('Process Payment Function', () => {
  let mockContext
  let mockReq

  beforeEach(() => {
    mockContext = {
      error: jest.fn(),
      log: jest.fn(),
      bindings: {},
      res: {}
    }

    mockReq = {
      body: {
        landownerGainSiteRegistration: {
          gainSiteReference: 'testReference',
          payment_status: 'testPaymentStatus'
        }
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should process a new payment with successful insertion', async () => {
    const mockDBConnection = {
      end: jest.fn()
    }
    getDBConnection.mockResolvedValueOnce(mockDBConnection)
    getApplicationPayment.mockResolvedValueOnce({ rowCount: 0 })
    insertApplicationPayment.mockResolvedValueOnce()

    await processPayment(mockContext, mockReq)

    expect(mockContext.res.status).toBe(200)
    expect(mockContext.bindings.outputSbQueue).toBeDefined()
  })

  it('should process an existing payment with successful update', async () => {
    const mockDBConnection = {
      end: jest.fn()
    }
    getDBConnection.mockResolvedValueOnce(mockDBConnection)
    getApplicationPayment.mockResolvedValueOnce({ rowCount: 1 })
    insertApplicationPayment.mockResolvedValueOnce()
    await processPayment(mockContext, mockReq)

    expect(mockContext.res.status).toBe(200)
    expect(mockContext.bindings.outputSbQueue).toBeDefined()
  })

  it('should handle errors during payment saving', async () => {
    getDBConnection.mockRejectedValueOnce(new Error('Database error'))

    await processPayment(mockContext, mockReq)

    expect(mockContext.res.status).toBe(400)
    expect(mockContext.res.body.toString()).toEqual('Error: Database error')
  })
})
