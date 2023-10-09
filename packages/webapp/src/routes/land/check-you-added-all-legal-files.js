import constants from '../../utils/constants.js'

import {
  getHumanReadableFileSize,
  processRegistrationTask,
  getLegalAgreementDocumentType,
  getDesiredFilenameFromRedisLocation
} from '../../utils/helpers.js'

const radioText = 'Have you added all legal agreement files?'
const radioHint = 'You must provide all legal agreement documents. This includes original versions if the legal agreement has been amended.'
const fileType = 'legal agreement'
const getCustomizedHTML = (item, index) => {
  const humanReadableFileSize = getHumanReadableFileSize(item.fileSize)
  const desiredFilename = getDesiredFilenameFromRedisLocation(item.location)
  const linkText = desiredFilename + ', ' + humanReadableFileSize
  const linkHref = `download-legal-agreement-file?id=${item.id}`
  return {

    key: {
      html: `<a href="${linkHref}" class="govuk-link">${linkText}</a>`,

      classes: 'govuk-summary-list govuk-!-font-weight-regular hmrc-list-with-actions hmrc-list-with-actions--short'
    },
    actions: {
      items: [{
        href: `${constants.routes.REMOVE_LEGAL_AGREEMENT_FILE}?id=${item.id}`,
        text: 'Remove'
      }],
      classes: 'govuk-summary-list__key govuk-!-font-weight-regular hmrc-summary-list__key'
    },
    class: 'govuk-summary-list__row'
  }
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.CHECK_LEGAL_AGREEMENT_FILES
    })
    const legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)
    const filesListWithAction = legalAgreementFiles?.map((currElement, index) => getCustomizedHTML(currElement, index))
    const selectedOption = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.CHECK_LEGAL_AGREEMENT_FILES, {
      filesListWithAction,
      selectedOption,
      radioText,
      radioHint,
      fileType,
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const checkLegalAgreement = request.payload.checkLegalAgreement
    const legalAgreementType = getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))
    const legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)
    const filesListWithAction = legalAgreementFiles?.map((currElement, index) => getCustomizedHTML(currElement, index))
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_CHECKED, checkLegalAgreement)
    if (checkLegalAgreement === 'no') {
      return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
    } else if (checkLegalAgreement === 'yes') {
      if (legalAgreementType === constants.LEGAL_AGREEMENT_TYPE_CONSERVATION) { return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES) } else {
        return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.ADD_LEGAL_AGREEMENT_PARTIES)
      }
    } else {
      const err = [{
        text: 'Select yes if you have added all legal agreement files',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_LEGAL_AGREEMENT_FILES, {
        err,
        filesListWithAction,
        radioText,
        radioHint,
        fileType,
        legalAgreementType
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LEGAL_AGREEMENT_FILES,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LEGAL_AGREEMENT_FILES,
  handler: handlers.post
}]
