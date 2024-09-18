import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.COMBINED_CASE_TASK_LIST

describe(url, () => {
  describe('GET', () => {
    let getOptions
    beforeEach(() => {
      getOptions = {
        url
      }
    })
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should render view with no completed task', async () => {
      let viewResult, contextResult
      const h = {
        view: (view, context) => {
          viewResult = view
          contextResult = context
        }
      }
      const redisMap = new Map()
      const request = {
        yar: redisMap
      }

      const creditsPurchaseTasklist = require('../../../routes/combined-case/tasklist')
      await creditsPurchaseTasklist.default[0].handler(request, h)

      const response = await submitGetRequest(getOptions)
      expect(response.statusCode).toBe(200)
      expect(viewResult).toEqual('combined-case/tasklist')
      expect(contextResult.tasks.taskList.length).toEqual(5)
      expect(contextResult.tasks.taskList[0]).toEqual({
        dependantIds: [],
        id: 'cc-app-info',
        taskTitle: 'Applicant information',
        items: [
          {
            id: 'add-applicant-information',
            title: { html: "<span id='add-applicant-information'>Add details about the applicant</span>" },
            status: {
              tag: {
                html: '<span id="add-applicant-information-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: '/combined-case/agent-acting-for-client'
          }
        ]
      })
      expect(contextResult.tasks.taskList[1]).toEqual({
        dependantIds: [],
        id: 'cc-land-info',
        taskTitle: 'Land information',
        items: [
          {
            id: 'add-land-ownership',
            title: { html: "<span id='add-land-ownership'>Add land ownership details</span>" },
            status: {
              tag: {
                html: '<span id="add-land-ownership-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: '/combined-case/upload-ownership-proof'
          },
          {
            id: 'add-land-boundary',
            title: { html: "<span id='add-land-boundary'>Add biodiversity gain site boundary details</span>" },
            status: {
              tag: {
                html: '<span id="add-land-boundary-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: '/combined-case/upload-land-boundary'
          },
          {
            id: 'add-habitat-information',
            title: { html: "<span id='add-habitat-information'>Add habitat baseline, creation and enhancements</span>" },
            status: {
              tag: {
                html: '<span id="add-habitat-information-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: '/combined-case/upload-metric'
          }
        ]
      })
      expect(contextResult.tasks.taskList[2]).toEqual({
        dependantIds: [],
        id: 'cc-legal-info',
        taskTitle: 'Legal information',
        items: [
          {
            id: 'add-legal-agreement',
            title: { html: "<span id='add-legal-agreement'>Add legal agreement details</span>" },
            status: {
              tag: {
                html: '<span id="add-legal-agreement-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: '/combined-case/legal-agreement-type'
          },
          {
            id: 'add-local-land-charge-search-certificate',
            title: { html: "<span id='add-local-land-charge-search-certificate'>Add local land charge search certificate</span>" },
            status: {
              tag: {
                html: '<span id="add-local-land-charge-search-certificate-status">Not started</span>',
                classes: 'govuk-tag--grey'
              }
            },
            href: '/combined-case/upload-local-land-charge'
          }
        ]
      })
      expect(contextResult.tasks.taskList[3]).toEqual({
        dependantIds: [
          'cc-app-info',
          'cc-land-info',
          'cc-legal-info'
        ],
        id: 'cc-allocation-info',
        taskTitle: 'Allocation information',
        items: [
          {
            id: 'planning-decision-notice',
            title: { html: "<span id='planning-decision-notice'>Add planning decision notice</span>" },
            isLocked: true,
            status: {
              tag: {
                html: '<span id="planning-decision-notice-status">Cannot start yet</span>',
                classes: 'govuk-tag--grey'
              }
            }
          },
          {
            id: 'match-available-habitats',
            title: { html: "<span id='match-available-habitats'>Match available habitats</span>" },
            isLocked: true,
            status: {
              tag: {
                html: '<span id="match-available-habitats-status">Cannot start yet</span>',
                classes: 'govuk-tag--grey'
              }
            }
          },
          {
            id: 'confirm-dev-and-habitat-details',
            title: { html: "<span id='confirm-dev-and-habitat-details'>Confirm development and habitat details</span>" },
            isLocked: true,
            status: {
              tag: {
                html: '<span id="confirm-dev-and-habitat-details-status">Cannot start yet</span>',
                classes: 'govuk-tag--grey'
              }
            }
          }
        ]
      })
      expect(contextResult.tasks.taskList[4]).toEqual({
        taskTitle: 'Submit your biodiversity gain information',
        items: [
          {
            id: 'check-your-answers',
            title: { text: 'Check your answers before you submit them' },
            status: {
              tag: {
                html: '<span id="check-your-answers-status">Cannot start yet</span>',
                classes: 'govuk-tag--grey'
              }
            }
          }
        ]
      })
    })
  })
})
