const dataString = `
{
  "registrationTaskDetails": {
    "taskList": [
      {
        "taskTitle": "Your details",
        "tasks": [
          {
            "title": "Add your details",
            "status": "COMPLETED",
            "completedTaskUrl": "/land/check-your-details",
            "startTaskUrl": "/land/name",
            "inProgressUrl": "/land/name",
            "id": "add-your-details"
          }
        ]
      },
      {
        "taskTitle": "Land information",
        "tasks": [
          {
            "title": "Add land boundary details",
            "status": "COMPLETED",
            "completedTaskUrl": "/land/check-land-boundary-details",
            "startTaskUrl": "/land/choose-land-boundary-upload",
            "inProgressUrl": "/land/add-grid-reference",
            "id": "add-land-boundary"
          },
          {
            "title": "Add land ownership details",
            "status": "COMPLETED",
            "completedTaskUrl": "/land/check-ownership-details",
            "startTaskUrl": "/land/upload-ownership-proof",
            "inProgressUrl": "/land/add-landowners",
            "id": "add-land-ownership"
          }
        ]
      },
      {
        "taskTitle": "Habitat information",
        "tasks": [
          {
            "title": "Upload Biodiversity Metric",
            "status": "COMPLETED",
            "completedTaskUrl": "/land/check-metric-details",
            "startTaskUrl": "/land/upload-metric",
            "inProgressUrl": "/land/check-metric-details",
            "id": "add-habitat-information"
          },
          {
            "title": "Add habitat management and monitoring details",
            "status": "COMPLETED",
            "completedTaskUrl": "/land/check-management-monitoring-details",
            "startTaskUrl": "/land/upload-management-plan",
            "inProgressUrl": "/land/check-management-monitoring-details",
            "id": "add-habitat-management"
          }
        ]
      },
      {
        "taskTitle": "Legal information",
        "tasks": [
          {
            "title": "Add legal agreement details",
            "status": "COMPLETED",
            "completedTaskUrl": "/land/check-legal-agreement-details",
            "startTaskUrl": "/land/legal-agreement-type",
            "inProgressUrl": "/land/add-legal-agreement-parties",
            "id": "add-legal-agreement"
          },
          {
            "title": "Add local land charge search certificate",
            "status": "COMPLETED",
            "completedTaskUrl": "/land/check-local-land-charge-file",
            "startTaskUrl": "/land/upload-local-land-charge",
            "inProgressUrl": "",
            "id": "add-local-land-charge-search-certificate"
          }
        ]
      },
      {
        "taskTitle": "Submit your biodiversity gain site information",
        "tasks": [
          {
            "title": "Check your answers and submit information",
            "status": "CANNOT START YET",
            "completedTaskUrl": "/land/check-and-submit",
            "startTaskUrl": "/land/check-and-submit",
            "inProgressUrl": "",
            "id": "check-your-answers"
          }
        ]
      }
    ]
  },
  "fullname": "Test Name",
  "role": "Ecologist",
  "role-other": "",
  "email-value": "test@test.com",
  "yes": "yes",
  "land-boundary": "documentOrImage",
  "land-boundary-location": "800376c7-8652-4906-8848-70a774578dfe/land-boundary/legal-agreement.doc",
  "land-boundary-file-size": 0.01,
  "land-boundary-file-type": "application/msword",
  "land-boundary-checked": "yes",
  "land-boundary-grid-reference": "SE170441",
  "land-boundary-hectares": 2,
  "land-ownership-location": "800376c7-8652-4906-8848-70a774578dfe/land-ownership/legal-agreement.doc",
  "land-ownership-file-size": 0.01,
  "land-ownership-file-type": "application/msword",
  "land-ownership-checked": "yes",
  "landowners": [
    "Landowner Name 1",
    "Landowner Name 2"
  ],
  "landowner-consent": "true",
  "metric-file-location": "800376c7-8652-4906-8848-70a774578dfe/metric-upload/new-metric-4.0.xlsm",
  "metric-file-size": 5.39,
  "metric-file-type": "application/vnd.ms-excel.sheet.macroEnabled.12",
  "metric-data": {
    "d1": [
      {
        "Broad habitat": "Cropland",
        "Habitat type": "Cereal crops",
        "Area (hectares)": 1,
        "Total habitat units": 2,
        "Condition": "Condition Assessment N/A"
      },
      {
        "Broad habitat": "Grassland",
        "Habitat type": "Modified grassland",
        "Area (hectares)": 1,
        "Total habitat units": 4,
        "Condition": "Moderate"
      },
      {
        "Broad habitat": "Woodland and forest",
        "Habitat type": "Other woodland; mixed",
        "Area (hectares)": 0.5,
        "Total habitat units": 2,
        "Condition": "Poor"
      },
      {
        "Broad habitat": "Grassland",
        "Habitat type": "Modified grassland",
        "Area (hectares)": 1,
        "Total habitat units": 2,
        "Condition": "Poor"
      },
      {
        "Habitat type": "Total habitat area",
        "Area (hectares)": 3.5,
        "Total habitat units": 10
      }
    ],
    "d2": [
      {
        "Delay in starting habitat creation (years)": 0,
        "Broad habitat": "Grassland",
        "Proposed habitat": "Other neutral grassland",
        "Area (hectares)": 0.9,
        "Condition": "Fairly Good",
        "Habitat units delivered": 7.0134822603,
        "Habitat created in advance (years)": 0
      },
      {
        "Delay in starting habitat creation (years)": 0,
        "Broad habitat": "Heathland and shrub",
        "Proposed habitat": "Bramble scrub",
        "Area (hectares)": 0.1,
        "Condition": "Condition Assessment N/A",
        "Habitat units delivered": 0.386,
        "Habitat created in advance (years)": 0
      },
      {
        "Proposed habitat": "Total habitat area",
        "Area (hectares)": 1,
        "Habitat units delivered": 7.3994822603
      }
    ],
    "d3": [
      {
        "Baseline habitat": "Grassland - Modified grassland",
        "Proposed Broad Habitat": "Wetland",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Area (hectares)": 1,
        "Condition": "Good",
        "Habitat units delivered": 7.027257226998999,
        "Proposed habitat": "Lowland raised bog"
      },
      {
        "Baseline habitat": "Woodland and forest - Other woodland; mixed",
        "Proposed Broad Habitat": "Woodland and forest",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Area (hectares)": 0.5,
        "Condition": "Good",
        "Habitat units delivered": 4.555818212099999,
        "Proposed habitat": "Other woodland; mixed"
      },
      {
        "Baseline habitat": "Grassland - Modified grassland",
        "Proposed Broad Habitat": "Grassland",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Area (hectares)": 1,
        "Condition": "Good",
        "Habitat units delivered": 4.9956750053,
        "Proposed habitat": "Modified grassland"
      },
      {
        "Area (hectares)": 2.5,
        "Habitat units delivered": 16.578750444399
      }
    ],
    "e1": [
      {
        "Hedgerow type": "Native hedgerow - associated with bank or ditch",
        "Length (km)": 0.3,
        "Total hedgerow units": 1.2,
        "Condition": "Poor"
      },
      {
        "Hedgerow type": "Native hedgerow",
        "Length (km)": 0.3,
        "Total hedgerow units": 0.6,
        "Condition": "Poor"
      },
      {
        "Length (km)": 0.6,
        "Total hedgerow units": 1.7999999999999998
      }
    ],
    "e2": [
      {
        "Habitat type": "Native hedgerow with trees",
        "Length (km)": 0.3,
        "Delay in starting habitat creation (years)": 0,
        "Hedge units delivered": 1.7654229486,
        "Condition": "Good",
        "Habitat created in advance (years)": 0
      },
      {
        "Length (km)": 0.3,
        "Hedge units delivered": 1.7654229486
      }
    ],
    "e3": [
      {
        "Baseline habitat": "Native hedgerow - associated with bank or ditch",
        "Length (km)": 0.3,
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Proposed habitat": "Native hedgerow - associated with bank or ditch",
        "Hedge units delivered": 2.27835855,
        "Condition": "Moderate"
      },
      {
        "Length (km)": 0.3,
        "Hedge units delivered": 2.27835855
      }
    ],
    "f1": [
      {
        "Watercourse type": "Ditches",
        "Length (km)": 0.3,
        "Total watercourse units": 1.2,
        "Condition": "Poor"
      },
      {
        "Watercourse type": "Ditches",
        "Length (km)": 0.3,
        "Total watercourse units": 1.2,
        "Condition": "Poor"
      },
      {
        "Length (km)": 0.6,
        "Total watercourse units": 2.4
      }
    ],
    "f2": [
      {
        "Watercourse type": "Ditches",
        "Habitat created in advance (years)": 0,
        "Delay in starting habitat creation (years)": 0,
        "Watercourse units delivered": 2.594403979575,
        "Condition": "Fairly Good",
        "Length (km)": 0.3
      },
      {
        "Watercourse units delivered": 2.594403979575,
        "Length (km)": 0.3
      }
    ],
    "f3": [
      {
        "Baseline habitat": "Ditches",
        "Length (km)": 0.3,
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Proposed habitat": "Ditches",
        "Watercourse units delivered": 2.409217854828,
        "Condition": "Good"
      },
      {
        "Length (km)": 0.3,
        "Watercourse units delivered": 2.409217854828
      }
    ],
    "validation": {
      "isVersion4OrLater": true,
      "isOffsiteDataPresent": true,
      "areOffsiteTotalsCorrect": true
    }
  },
  "metric-file-checked": "yes",
  "check-uploaded-metric": true,
  "management-plan-location": "800376c7-8652-4906-8848-70a774578dfe/management-plan/legal-agreement.doc",
  "management-plan-file-size": 0.01,
  "management-plan-file-type": "application/msword",
  "management-plan-checked": "yes",
  "management-monitoring-start-date": "2022-01-01T00:00:00.000Z",
  "legal-agreement-type": "759150001",
  "legal-agreement-location": "800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement.doc",
  "legal-agreement-file-size": 0.01,
  "legal-agreement-file-type": "application/msword",
  "legal-agreement-checked": "yes",
  "legal-agreement-file-option": "yes",
  "legal-agreement-parties": [
    {
      "organisationName": "org1",
      "organisationRole": "Developer",
      "organisationOtherRole": "undefined"
    },
    {
      "organisationName": "org2",
      "organisationRole": "Landowner",
      "organisationOtherRole": "undefined"
    }
  ],
  "legal-agreement-reponsible-bodies":[
    {
      "responsibleBodyName": "test1"
    },
    {
      "responsibleBodyName": "test2"
    }
  ],
  "legal-agreement-landowner-conservation-convents": [{
    "organisationName": "org1",
    "type": "organisation"
  }, {
    "firstName": "Crishn",
    "middleNames": "",
    "lastName": "P",
    "type": "individual"
  }],
  "legal-agreement-start-date": "2022-01-01T00:00:00.000Z",
  "legal-agreement-end-date": "2023-01-01T00:00:00.000Z",
  "local-land-charge-location": "800376c7-8652-4906-8848-70a774578dfe/local-land-charge/local-land-charge.doc",
  "local-land-charge-file-size": 0.01,
  "local-land-charge-file-type": "application/msword",
  "application-reference": ""
}`

export default {
  dataString
}
