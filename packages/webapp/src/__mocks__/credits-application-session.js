import Session from './session.js'
import creditsApplicationMock from './credits-application-data.js'

const creditsApplicationSession = () => {
  const session = new Session()
  Object.keys(creditsApplicationMock).forEach((item) => {
    session.set(item, creditsApplicationMock[item])
  })
  return session
}

export default creditsApplicationSession
