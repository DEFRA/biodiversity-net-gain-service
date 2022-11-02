import wreck from '@hapi/wreck'

wreck.defaults({
  timeout: 30 * 1000
})

const postJson = function (url, payload) {
  return wreck
    .post(url, {
      json: true,
      payload
    })
    .then(response => {
      if (response.res.statusCode !== 200) {
        throw new Error('Requested resource returned a non 200 status code')
      }
      return JSON.parse(response.payload.toString())
    })
}

export {
  postJson
}
