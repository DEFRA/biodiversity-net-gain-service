import { post } from './base.js'
import { SERVICE_HOME_URL, PAYMENT_API_KEY, PAYMENT_API_URL } from '../../utils/config.js'

const createPayment = async (payload) => {
  const payment = {
    amount: payload.amount,
    reference: payload.reference,
    description: payload.description,
    prefilled_cardholder_details: {
      cardholder_name: payload.cardholder_name
    },
    email: payload.email,
    return_url: payload.return_url || `${SERVICE_HOME_URL}/payment-return`,
    language: 'en'
  }

  return post(PAYMENT_API_URL, payment, PAYMENT_API_KEY)
}

export default createPayment
