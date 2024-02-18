import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const handlers = {
  get: async (request, h) => {
    const tasks = {
      taskList: [
        {
          taskTitle: 'Statutory biodiversity metric',
          tasks: [
            {
              title: 'Upload statutory biodiversity metric',
              status: 'NOT STARTED',
              url: '#',
              id: 'upload-metric'
            }
          ]
        },
        {
          taskTitle: 'Statutory biodiversity credits',
          tasks: [
            {
              title: 'Add statutory biodiversity credits',
              status: 'NOT STARTED',
              url: '#',
              id: 'add-credits'
            }
          ]
        },
        {
          taskTitle: 'Purchase order',
          tasks: [
            {
              title: 'Add a purchase order number',
              status: 'NOT STARTED',
              url: '#',
              id: 'add-purchase-order'
            }
          ]
        },
        {
          taskTitle: 'Customer due diligence (CDD)',
          tasks: [
            {
              title: 'Complete customer due diligence',
              status: 'NOT STARTED',
              url: '#',
              id: 'customer-due-diligence'
            }
          ]
        },
        {
          taskTitle: 'Terms and conditions',
          tasks: [
            {
              title: 'Accept terms and conditions',
              status: 'NOT STARTED',
              url: '#',
              id: 'terms-and-conditions'
            }
          ]
        },
        {
          taskTitle: 'Submit your biodiversity gain site information',
          tasks: [
            {
              title: 'Check your answers and submit information',
              status: 'CANNOT START YET',
              url: '#',
              id: 'upload-metric'
            }
          ]
        }
      ]
    }

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_TASK_LIST, {
      completedTasks: 1,
      totalSections: 6,
      tasks
    })
  }
}

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST,
    handler: handlers.get
  }
]
