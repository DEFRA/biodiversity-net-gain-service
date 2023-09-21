const buildSignalRMessage = (signalRMessageConfig, signalRMessageArguments) => {
  const signalRMessage = { ...signalRMessageConfig }
  signalRMessage.arguments = signalRMessageArguments
  return signalRMessage
}

export default buildSignalRMessage
