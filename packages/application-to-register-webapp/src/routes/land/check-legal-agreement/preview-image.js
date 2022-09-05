import fs from 'fs'
import constants from '../../../utils/constants.js'

const retrieveImageToPreview = async (request, h) => {
  const previewFilePath = request.yar.get(`PREVIEW_FILE_PATH_${request.yar.id}`)
  const imageContent = fs.readFileSync(previewFilePath)

  return h.response(imageContent).header('Content-Disposition', 'inline; filename= ' + 'testName.png').header('content-type', 'image/png')
}
export default {
  method: 'GET',
  path: constants.routes.DOWNLOAD_FIRST_PAGE_IMAGE,
  handler: retrieveImageToPreview
}
