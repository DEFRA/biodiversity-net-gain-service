import Session from '../../__mocks__/session.js'
import { setPayment, getPayment } from '../payment-session.js'

const payment = {
  caseType: 'registration',
  fee: 600,
  reference: 'REG-1234',
  type: 'BACS'
}

describe('payment session storage', () => {
  it('set should store payment', () => {
    const session = new Session()

    setPayment(session, payment)

    expect(session.values.payment).toEqual(payment)
  })
  it('get should return payment', () => {
    const session = new Session()

    session.set('payment', payment)

    const res = getPayment(session)

    expect(res).toEqual(payment)
  })
})
