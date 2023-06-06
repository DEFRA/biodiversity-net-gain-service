import Session from './session.js'
import developerApplicationMock from './developer-application-data.js'

const developerApplicationSession = () => {
  const session = new Session()
  Object.keys(developerApplicationMock.developerAllocation).forEach((item) => {
    session.set(item, developerApplicationMock.developerAllocation[item])
  })
  return session
}

export default developerApplicationSession
