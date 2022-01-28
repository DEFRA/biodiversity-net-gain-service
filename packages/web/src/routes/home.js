import Joi from '@hapi/joi'

const home = [{
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return h.view('home')
  }
}, {
  method: 'POST',
  path: '/',
  handler: (request, h) => {
    return h.view('home', {
      helloWorld: request.payload.helloWorld
    })
  },
  options: {
    validate: {
      payload: Joi.object().keys({
        helloWorld: Joi.string().required()
      })
    }
  }
}]

export default home
