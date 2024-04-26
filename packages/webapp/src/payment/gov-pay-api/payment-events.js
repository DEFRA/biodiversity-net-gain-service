const { get } = require('./base')
const formatDate = require('../lib/format-date')
const { PAYMENT_API_KEY, PAYMENT_API_URL } = require('../../utils/config.js')

const paymentEvents = async (id) => {
  let eventsResponse = await get(`${PAYMENT_API_URL}/${id}/events`, PAYMENT_API_KEY)
  eventsResponse = formatDate(eventsResponse.events, 'updated')
  return eventsResponse
}

module.exports = paymentEvents
