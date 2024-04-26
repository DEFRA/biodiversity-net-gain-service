const wreck = require('@hapi/wreck')

const get = async (url, token) => {
  const { payload } = await wreck.get(url, getConfiguration(token))
  return payload
}

const post = async (url, data, token) => {
  const { payload } = await wreck.post(url, {
    payload: data,
    ...getConfiguration(token)
  })

  return payload
}

const getConfiguration = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  }
}

module.exports = {
  get,
  post
}
