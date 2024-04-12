const data = `{
  "contact-id": "mock contact id",
  "metric-file-checked": "yes",
  "application-reference": "",
  "biodiversity-net-gain-number": "BGS-111 222 333",
  "developer-task-details": {
    "taskList": [
      {
        "taskTitle": "Your details",
        "tasks": [
          {
            "title": "Add your details",
            "status": "COMPLETED",
            "completedTaskUrl": "/developer/details-confirm",
            "startTaskUrl": "/developer/details-name",
            "inProgressUrl": "/developer/details-name",
            "id": "add-your-details"
          }
        ]
      },
      {
        "taskTitle": "Biodiversity 4.1 Metric calculations",
        "tasks": [
          {
            "title": "Upload Metric 4.1 file",
            "status": "COMPLETED",
            "completedTaskUrl": "/developer/biodiversity-gain-site-number",
            "startTaskUrl": "/developer/biodiversity-gain-site-number",
            "inProgressUrl": "/developer/upload-metric-file",
            "id": "upload-metric-file"
          },
          {
            "title": "Confirm development details",
            "status": "COMPLETED",
            "completedTaskUrl": "/developer/confirm-development-details",
            "startTaskUrl": "/developer/confirm-development-details",
            "inProgressUrl": "/developer/upload-metric-file",
            "id": "confirm-development-details"
          },
          {
            "title": "Confirm off-site gain",
            "status": "COMPLETED",
            "completedTaskUrl": "/developer/confirm-off-site-gain",
            "startTaskUrl": "/developer/confirm-off-site-gain",
            "inProgressUrl": "/developer/upload-metric-file",
            "id": "confirm-off-site-gain"
          }
        ]
      },
      {
        "taskTitle": "Consent to use a biodiversity gain site for off-site gain",
        "tasks": [
          {
            "title": "Upload the consent document",
            "status": "COMPLETED",
            "completedTaskUrl": "/developer/consent-agreement-upload",
            "startTaskUrl": "/developer/consent-agreement-upload",
            "inProgressUrl": "/developer/consent-agreement-upload",
            "id": "upload-consent-document"
          }
        ]
      },
      {
        "taskTitle": "Submit your biodiversity gain information",
        "tasks": [
          {
            "title": "Check your answers before you submit them to us",
            "status": "CANNOT START YET",
            "completedTaskUrl": "/developer/email-entry",
            "startTaskUrl": "/developer/check-answers",
            "inProgressUrl": "/developer/check-answers",
            "id": "check-your-answer"
          }
        ]
      }
    ]
  },
  "developer-metric-file-location": "fb69298f-fbae-4a53-a691-64cd6540ba41/metric-upload/data.xlsm",
  "developer-metric-filesize": 5016056,
  "developer-metric-filetype": "application/vnd.ms-excel.sheet.macroEnabled.12",
  "gainSite": {
    "reference": "BNGREG-0001",
    "offsiteUnitChange": {
      "habitat": 16.717164037912525,
      "hedge": -0.020917119698400044,
      "watercourse": 0
    }
  },
  "habitats": [
    {
      "habitatId": "H1",
      "area": 2,
      "module": "Created",
      "state": "Habitat",
      "measurementUnits": "hectares"
    },
    {
      "habitatId": "H2",
      "area": 2,
      "module": "Created",
      "state": "Habitat",
      "measurementUnits": "hectares"
    },
    {
      "habitatId": "H3",
      "area": 0.04,
      "module": "Created",
      "state": "Habitat",
      "measurementUnits": "hectares"
    },
    {
      "habitatId": "H1",
      "area": 0.074,
      "module": "Created",
      "state": "Hedge",
      "measurementUnits": "kilometres"
    },
    {
      "habitatId": "H3",
      "area": 0.4004,
      "module": "Enhanced",
      "state": "Habitat",
      "measurementUnits": "hectares"
    },
    {
      "habitatId": "H1",
      "area": 0.3673,
      "module": "Enhanced",
      "state": "Habitat",
      "measurementUnits": "hectares"
    },
    {
      "habitatId": "E3",
      "area": 0.226,
      "module": "Enhanced",
      "state": "Hedge",
      "measurementUnits": "kilometres"
    },
    {
      "habitatId": "F3",
      "area": 1,
      "module": "Enhanced",
      "state": "Watercourse",
      "measurementUnits": "kilometres"
    }
  ],
  "developer-metric-filename": "data.xlsm",
  "developer-fullname": "Test Name",
  "developer-role-key": "Developer",
  "developer-email-value": "test@test.com",
  "developer-confirm-email": "yes",
  "offsite-details-checked": "yes",
  "developer-consent-file-location": "fb69298f-fbae-4a53-a691-64cd6540ba41/developer-upload-consent/Lorem ipsum dolor sit amet.docx",
  "developer-consent-file-size": 20821,
  "developer-consent-file-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "developer-consent-file-name": "Lorem ipsum dolor sit amet.docx",
  "developer-consent-answer": true
}`

export default {
  data
}
