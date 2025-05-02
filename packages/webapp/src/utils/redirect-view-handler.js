const addRedirectViewUsed = (handler) => {
  return async (request, h) => {
    request.redirectViewUsed = true
    return handler(request, h)
  }
}

export { addRedirectViewUsed }
