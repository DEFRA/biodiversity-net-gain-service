const paymentKey = 'payment'

const getPayment = session => session?.get(paymentKey)

const setPayment = (session, value) => session?.set(paymentKey, value)

export {
  getPayment,
  setPayment
}
