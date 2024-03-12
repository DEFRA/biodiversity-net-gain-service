const randomReferenceString = (length) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const retry = async (query, options, retries = 5) => {
  for (let i = 1; i <= retries; i++) {
    try {
      return await query(...options)
    } catch (error) {
      if (i === retries) {
        throw error
      }
    }
  }
}

export {
  randomReferenceString,
  retry
}
