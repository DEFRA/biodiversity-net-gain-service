import { get } from './base.js'
import { formatDate } from '../../utils/helpers.js'
import { PAYMENT_API_KEY, PAYMENT_API_URL } from '../../utils/config.js'

const paymentEvents = async (id) => {
  let eventsResponse = await get(`${PAYMENT_API_URL}/${id}/events`, PAYMENT_API_KEY)
  eventsResponse = formatDate(eventsResponse.events, 'updated')
  return eventsResponse
}

export default paymentEvents
