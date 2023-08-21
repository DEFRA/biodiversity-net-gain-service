import fees from './fees.js'
import { setPayment } from './payment-session.js'

const savePayment = (session, caseType, reference) => {
  const fee = fees.find(x => x.caseType === caseType)

  fee.reference = reference
  fee.type = 'BACS'

  setPayment(session, 'payment', fee)

  return fee
}

export default savePayment
