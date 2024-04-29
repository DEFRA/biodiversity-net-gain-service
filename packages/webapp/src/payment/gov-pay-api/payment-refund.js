import { get, post } from './base.js';
import { formatDate } from '../../utils/helpers.js';
import { PAYMENT_API_KEY, PAYMENT_API_URL } from '../../utils/config.js';

const viewPaymentRefunds = async (id) => {
  let refundResponse = await get(`${PAYMENT_API_URL}/${id}/refunds`, PAYMENT_API_KEY);
  refundResponse = formatDate(refundResponse._embedded.refunds, 'created_date');
  return refundResponse;
};

const refundPayment = async (id, refundAmount, refundAvailable) => {
  const payload = {
    amount: parseInt(refundAmount),
    refund_amount_available: parseInt(refundAvailable)
  };

  return post(`${PAYMENT_API_URL}/${id}/refunds`, payload, PAYMENT_API_KEY);
};

export { refundPayment, viewPaymentRefunds };
