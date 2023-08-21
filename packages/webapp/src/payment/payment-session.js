const paymentKey = 'payment'

const get = (session, entryKey, key) => {
  return key ? session?.get(entryKey)?.[key] : session?.get(entryKey)
}

const set = (session, entryKey, key, value) => {
  const entryValue = session?.get(entryKey) || {}

  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  session.set(entryKey, entryValue)
}

const getPayment = (session, key) => {
  return get(session, paymentKey, key)
}

const setPayment = (session, key, value) => {
  set(session, paymentKey, key, value)
}

export {
  getPayment,
  setPayment
}
