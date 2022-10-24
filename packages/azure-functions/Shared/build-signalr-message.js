const buildSignalRMessage = (signalRMessageConfig, signalRMessageArguments) => {
  const signalRMessage = Object.assign({}, signalRMessageConfig)
  signalRMessage.arguments = signalRMessageArguments
  return signalRMessage
}

export default buildSignalRMessage
