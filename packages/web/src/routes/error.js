const error = {
  method: 'GET',
  path: '/error',
  handler: (request, h) => {
    throw new Error('test')
  }
}

export default error
