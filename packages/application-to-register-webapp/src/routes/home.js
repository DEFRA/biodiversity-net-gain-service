import Joi from 'joi'

const home = [{
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    return h.view('home', {
      helloWorld: request.yar.get('helloWorld') || 'session not set' // show helloWorld from session or not set
    })
  }
}, {
  method: 'POST',
  path: '/',
  handler: (request, h) => {
    request.yar.set('helloWorld', request.payload.helloWorld)
    return h.redirect('/')
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
