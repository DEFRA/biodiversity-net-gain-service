const paymentKey = 'payment'

const getPayment = (session) => {
  return session?.get(paymentKey)
}

const setPayment = (session, value) => {
  session?.set(paymentKey, value)
}

export {
  getPayment,
  setPayment
}
