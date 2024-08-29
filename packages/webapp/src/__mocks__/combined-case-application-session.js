import Session from './session.js'
import combinedCaseApplicationMock from './combined-case-application-data.js'

const combinedCaseApplicationSession = () => {
  const session = new Session()
  Object.keys(combinedCaseApplicationMock).forEach((item) => {
    session.set(item, combinedCaseApplicationMock[item])
  })
  return session
}

export default combinedCaseApplicationSession
