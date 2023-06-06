import Session from './session.js'
import developerApplicationMock from './developer-application-data.js'

const setDeveloperApplicationSession = () => {
  const session = new Session()
  Object.keys(developerApplicationMock).forEach((item) => {
    session.set(item, developerApplicationMock[item])
  })
  return session
}

export default setDeveloperApplicationSession
