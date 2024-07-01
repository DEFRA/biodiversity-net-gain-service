import fees from './fees.js'
import { setPayment } from './payment-session.js'
import constants from '../utils/constants.js'

const savePayment = (session, caseType, reference) => {
  const fee = fees.find(x => x.caseType === caseType)

  fee.reference = reference
  fee.type = session.get(constants.redisKeys.PAYMENT_TYPE)
  fee.govPayReference = session.get(constants.redisKeys.GOV_PAY_REFERENCE)
  fee.method = fee?.type?.toLowerCase() !== 'bacs' ? 'Card' : 'BACS'
  fee.paymentDate = session.get(constants.redisKeys.GOV_PAY_PAYMENT_DATE)
  fee.paymentStatus = session.get(constants.redisKeys.GOV_PAY_PAYMENT_STATUS)

  setPayment(session, fee)

  return fee
}

export default savePayment
