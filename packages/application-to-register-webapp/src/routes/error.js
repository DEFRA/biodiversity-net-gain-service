const error = {
  method: 'GET',
  path: '/error',
  handler: () => {
    throw new Error('test')
  }
}

export default error
