import { randomBytes } from 'crypto'

const randomReferenceString = (length) => {
  return new Promise((resolve, reject) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < length; i++) {
      randomBytes(1, (error, randomByte) => {
        if (error) {
          reject(error)
        }
        const randomIndex = Math.floor(randomByte[0] / 255 * chars.length)
        result += chars[randomIndex]
        if (result.length === length) {
          resolve(result)
        }
      })
    }
  })
}

const retryDbOperation = async (query, options, retries = 5) => {
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
  retryDbOperation
}
