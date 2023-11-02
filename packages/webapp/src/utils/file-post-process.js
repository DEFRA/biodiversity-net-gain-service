import { postJson } from './http.js'
import constants from './constants.js'

const postProcess = async (uploadType, blobName, containerName) => {
  return postJson(`${constants.AZURE_FUNCTION_APP_URL}/processtrustedfile`, {
    uploadType,
    blobName,
    containerName
  })
}

export {
  postProcess
}
