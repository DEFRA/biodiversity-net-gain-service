import constants from './constants.js'
import { postJson } from './http.js'

const saveApplicationSessionIfNeeded = async (session, resetApplicationSessionAfterSave = false) => {
  // session must be the Hapi.js Yar instance attached to a request.
  if (session.get(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT_OR_JOURNEY_CHANGE)) {
    // Save unpersisted journey data
    await postJson(`${constants.AZURE_FUNCTION_APP_URL}/saveapplicationsession`, session._store)
  }

  if (resetApplicationSessionAfterSave) {
    // Clear data associated with an existing registration or allocation journey.
    session.reset()
  }
}

export default saveApplicationSessionIfNeeded
