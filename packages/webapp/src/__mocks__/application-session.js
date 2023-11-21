import Session from './session.js'
import testApplication from '../__mock-data__/test-application.js'

const applicationSession = () => {
  const session = new Session()
  const application = JSON.parse(testApplication.dataString)
  Object.keys(application).forEach((item) => {
    session.set(item, application[item])
  })
  return session
}

export default applicationSession
