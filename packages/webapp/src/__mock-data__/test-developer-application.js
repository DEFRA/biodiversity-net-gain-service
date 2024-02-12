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
  "developer-metric-data": {
    "startPage": {
      "planningAuthority": "County Council",
      "projectName": "Project",
      "planningApplicationReference": "REF-1234",
      "targetNetGain": 0.1,
      "irreplaceableHabitatPresentOnSiteAtBaseline": "You must specify if irreplaceable habitats are on-site at baseline ▲",
      "totalSiteAreaIncludingIrreplaceableHabitatArea": 3.5,
      "containsDeviationsFromTheStatutoryMetricThisMustBeAgreedWithConsentingBody": "",
      "⚠": "Attention required",
      "▲": "Input error/rules and principles not met",
      "onSiteBaselineMapReferenceNumber": "On-site post-intervention map reference number",
      "offSiteBaselineMapReferenceNumber": "Off-site post-intervention reference number",
      "cells": { "version": 4 }
    },
    "d1": [
      {
        "Broad habitat": "Cropland",
        "Habitat type": "Cereal crops",
        "Area (hectares)": 1,
        "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
        "Total habitat units": 2,
        "Off-site reference": "BGS-111 222 333",
        "Condition": "Condition Assessment N/A"
      },
      {
        "Broad habitat": "Grassland",
        "Habitat type": "Modified grassland",
        "Area (hectares)": 1,
        "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
        "Total habitat units": 4,
        "Off-site reference": "BGS-111 222 333",
        "Condition": "Moderate"
      },
      {
        "Broad habitat": "Woodland and forest",
        "Habitat type": "Other woodland; mixed",
        "Area (hectares)": 0.5,
        "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
        "Total habitat units": 2,
        "Off-site reference": "BGS-111 222 333",
        "Condition": "Poor"
      },
      {
        "Broad habitat": "Grassland",
        "Habitat type": "Modified grassland",
        "Area (hectares)": 1,
        "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
        "Total habitat units": 2,
        "Off-site reference": "BGS-111 222 333",
        "Condition": "Poor"
      }
    ],
    "d2": [
      {
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": "BGS-111 222 333",
        "Broad habitat": "Grassland",
        "Proposed habitat": "Other neutral grassland",
        "Area (hectares)": 0.9,
        "Condition": "Fairly Good",
        "Habitat units delivered": 7.0134822603,
        "Habitat created in advance (years)": 0
      },
      {
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": "BGS-111 222 333",
        "Broad habitat": "Heathland and shrub",
        "Proposed habitat": "Bramble scrub",
        "Area (hectares)": 0.1,
        "Condition": "Condition Assessment N/A",
        "Habitat units delivered": 0.386,
        "Habitat created in advance (years)": 0
      }
    ],
    "d3": [
      {
        "Baseline habitat": "Grassland - Modified grassland",
        "Total habitat area": 1,
        "Proposed Broad Habitat": "Wetland",
        "Condition change": "Lower Distinctiveness Habitat - Good",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": "BGS-111 222 333",
        "Area (hectares)": 1,
        "Condition": "Good",
        "Habitat units delivered": 7.027257226998999,
        "Proposed habitat": "Lowland raised bog",
        "Distinctiveness change": "Low - V.High"
      },
      {
        "Baseline habitat": "Woodland and forest - Other woodland; mixed",
        "Total habitat area": 0.5,
        "Proposed Broad Habitat": "Woodland and forest",
        "Condition change": "Poor - Good",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": "BGS-111 222 333",
        "Area (hectares)": 0.5,
        "Condition": "Good",
        "Habitat units delivered": 4.555818212099999,
        "Proposed habitat": "Other woodland; mixed",
        "Distinctiveness change": "Medium - Medium"
      },
      {
        "Baseline habitat": "Grassland - Modified grassland",
        "Total habitat area": 1,
        "Proposed Broad Habitat": "Grassland",
        "Condition change": "Poor - Good",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": "BGS-111 222 333",
        "Area (hectares)": 1,
        "Condition": "Good",
        "Habitat units delivered": 4.9956750053,
        "Proposed habitat": "Modified grassland",
        "Distinctiveness change": "Low - Low"
      }
    ],
    "e1": [
      {
        "Hedge number": 1,
        "Hedgerow type": "Native hedgerow - associated with bank or ditch",
        "Length (km)": 0.3,
        "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
        "Total hedgerow units": 1.2,
        "Off-site reference": "BGS-111 222 333",
        "Condition": "Poor"
      },
      {
        "Hedge number": 2,
        "Hedgerow type": "Native hedgerow",
        "Length (km)": 0.3,
        "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
        "Total hedgerow units": 0.6,
        "Off-site reference": "BGS-111 222 333",
        "Condition": "Poor"
      }
    ],
    "e2": [
      {
        "Habitat type": "Native hedgerow with trees",
        "Length (km)": 0.3,
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": "BGS-111 222 333",
        "Hedge units delivered": 1.7654229486,
        "Condition": "Good",
        "Habitat created in advance (years)": 0
      }
    ],
    "e3": [
      {
        "Baseline habitat": "Native hedgerow - associated with bank or ditch",
        "Length (km)": 0.3,
        "Habitat enhanced in advance (years)": 0,
        "Off-site reference": "BGS-111 222 333",
        "Hedge units delivered": 2.27835855,
        "Condition": "Moderate"
      }
    ],
    "f1": [
      {
        "Watercourse type": "Ditches",
        "Length (km)": 0.3,
        "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
        "Extent of encroachment": "No Encroachment",
        "Extent of encroachment for both banks": "No Encroachment/ No Encroachment",
        "Total watercourse units": 1.2,
        "Off-site reference": "BGS-111 222 333",
        "Condition": "Poor"
      },
      {
        "Watercourse type": "Ditches",
        "Length (km)": 0.3,
        "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
        "Extent of encroachment": "No Encroachment",
        "Extent of encroachment for both banks": "No Encroachment/ No Encroachment",
        "Total watercourse units": 1.2,
        "Off-site reference": "BGS-111 222 333",
        "Condition": "Poor"
      }
    ],
    "f2": [
      {
        "Habitat created in advance (years)": 0,
        "Delay in starting habitat creation (years)": 0,
        "Extent of encroachment for both banks": "No Encroachment/ No Encroachment",
        "Off-site reference": "BGS-111 222 333",
        "Watercourse units delivered": 2.594403979575,
        "Condition": "Fairly Good",
        "Length (km)": 0.3
      }
    ],
    "f3": [
      {
        "Baseline habitat": "Ditches",
        "Length (km)": 0.3,
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Extent of encroachment": "No Encroachment",
        "Extent of encroachment for both banks": "No Encroachment/ No Encroachment",
        "Off-site reference": "BGS-111 222 333",
        "Proposed habitat": "Ditches",
        "Watercourse units delivered": 2.409217854828,
        "Condition": "Good"
      }
    ],
    "validation": {
      "isMetricWorkbook": true,
      "isSupportedVersion": true,
      "isOffsiteDataPresent": true,
      "areOffsiteTotalsCorrect": {}
    }
  },
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
