import savePayment from '../save-payment.js'
import * as paymentSession from '../payment-session.js'

jest.mock('../fees.js', () => [
  {
    caseType: 'registration',
    fee: 500
  },
  {
    caseType: 'allocation',
    fee: 20
  }
])

jest.mock('../payment-session.js')

describe('save payment fee', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should call save payment', () => {
    savePayment({}, 'registration', 'BNG-1234')

    expect(paymentSession.setPayment).toHaveBeenCalledTimes(1)
  })
  describe('registration', () => {
    it('should return fee', () => {
      const fee = savePayment({}, 'registration', 'BNG-1234')

      expect(fee.caseType).toEqual('registration')
      expect(fee.fee).toEqual(500)
      expect(fee.type).toEqual('BACS')
      expect(fee.reference).toEqual('BNG-1234')
    })
  })
  describe('allocation', () => {
    it('should return fee', () => {
      const fee = savePayment({}, 'allocation', 'BNG-1234')

      expect(fee.caseType).toEqual('allocation')
      expect(fee.fee).toEqual(20)
      expect(fee.type).toEqual('BACS')
      expect(fee.reference).toEqual('BNG-1234')
    })
  })
})
