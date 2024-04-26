const moment = require('moment')
const { get } = require('./base')
const { viewPaymentRefunds } = require('./payment-refund')
const paymentEvents = require('./payment-events')
const { PAYMENT_API_KEY, PAYMENT_API_URL } = require('../../utils/config.js')

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

module.exports = {
  paymentDetails,
  fullPaymentDetails
}
