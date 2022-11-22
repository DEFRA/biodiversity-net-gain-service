import Session from './session.js'
import applicationMock from './application-data.js'

const applicationSession = () => {
  const session = new Session()
  Object.keys(applicationMock).forEach((item) => {
    session.set(item, applicationMock[item])
  })
  return session  
}

export default applicationSession
