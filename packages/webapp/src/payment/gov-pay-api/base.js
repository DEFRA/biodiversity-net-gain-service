import wreck from '@hapi/wreck'

const get = async (url, token) => {
  try {
    const { payload } = await wreck.get(url, getConfiguration(token))
    return payload
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`)
  }
}

const post = async (url, data, token) => {
  try {
    const { payload } = await wreck.post(url, {
      payload: data,
      ...getConfiguration(token)
    })
    return payload
  } catch (error) {
    throw new Error(`Error posting data: ${error.message}`)
  }
}

const getConfiguration = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  }
}

export { get, post }
