const { post } = require('./base')
const { PAYMENT_API_URL, PAYMENT_API_KEY } = require('../../utils/config.js')

const cancelPayment = async (id) => {
  return post(`${PAYMENT_API_URL}/${id}/cancel`, {}, PAYMENT_API_KEY)
}

module.exports = cancelPayment
