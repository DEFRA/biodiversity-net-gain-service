const { get, post } = require('./base')
const formatDate = require('../lib/format-date')
const { PAYMENT_API_KEY, PAYMENT_API_URL } = require('../../utils/config.js')

const viewPaymentRefunds = async (id) => {
  let refundResponse = await get(`${PAYMENT_API_URL}/${id}/refunds`, PAYMENT_API_KEY)
  refundResponse = formatDate(refundResponse._embedded.refunds, 'created_date')
  return refundResponse
}

const refundPayment = async (id, refundAmount, refundAvailable) => {
  const payload = {
    amount: parseInt(refundAmount),
    refund_amount_available: parseInt(refundAvailable)
  }

  return post(`${PAYMENT_API_URL}/${id}/refunds`, payload, PAYMENT_API_KEY)
}

module.exports = {
  refundPayment,
  viewPaymentRefunds
}
