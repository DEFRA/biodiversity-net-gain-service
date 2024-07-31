import constants from '../../utils/constants.js'
import { getTaskList } from '../../journey-validation/task-list-generator.js'
import application from '../../utils/combined-case-application.js'

const handlers = {
  get: (request, h) => {
    const { canSubmit } = getTaskList(constants.applicationTypes.COMBINED_CASE, request.yar)

    if (!canSubmit) {
      return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
    }

    const applicationDetails = application(request.yar, request.auth.credentials.account)
    console.log(JSON.stringify(applicationDetails, null, 2))

    return h.view(constants.views.COMBINED_CASE_CHECK_AND_SUBMIT)
  },
  post: async (request, h) => {
    return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.COMBINED_CASE_CHECK_AND_SUBMIT,
    handler: handlers.post
  }
]
