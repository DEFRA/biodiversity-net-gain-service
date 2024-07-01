import moment from 'moment'
import { get } from './base.js'
import { viewPaymentRefunds } from './payment-refund.js'
import paymentEvents from './payment-events.js'
import { PAYMENT_API_KEY, PAYMENT_API_URL } from '../../utils/config.js'

const fullPaymentDetails = async (id) => {
  const paymentResponse = await get(`${PAYMENT_API_URL}/${id}`, PAYMENT_API_KEY)
  paymentResponse.date = moment(paymentResponse.created_date).format('DD-MM-YYYY hh:mm:ss')

  const refundResponse = await viewPaymentRefunds(id)
  const eventsResponse = await paymentEvents(id)

  return { payment: paymentResponse, events: eventsResponse, refunds: refundResponse }
}

const paymentDetails = async (id) => {
  return get(`${PAYMENT_API_URL}/${id}`, PAYMENT_API_KEY)
}

export { paymentDetails, fullPaymentDetails }
