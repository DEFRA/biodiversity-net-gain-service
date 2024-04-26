const { get } = require('./base')
const moment = require('moment')
const { PAYMENT_API_KEY, PAYMENT_API_URL } = require('../../utils/config.js')

const viewPayments = async (query) => {
  const res = await get(`${PAYMENT_API_URL}?${query}`, PAYMENT_API_KEY)

  const paymentRes = res.results.map(r => {
    const date = moment(r.created_date).format('DD-MM-YYYY hh:mm:ss')

    return { ...r, date }
  })

  return { results: paymentRes }
}

module.exports = viewPayments
