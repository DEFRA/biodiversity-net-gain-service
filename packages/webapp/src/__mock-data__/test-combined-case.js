const dataString = `
{
    "contact-id": "ca32f764-a3d0-ee11-9079-6045bd90523f",
    "registrationTaskDetails": {
      "taskList": [
        {
          "taskTitle": "Applicant information",
          "tasks": [
            {
              "title": "Add details about the applicant",
              "status": "COMPLETED",
              "completedTaskUrl": "/land/check-applicant-information",
              "startTaskUrl": "/land/agent-acting-for-client",
              "inProgressUrl": "",
              "id": "add-applicant-information"
            }
          ]
        },
        {
          "taskTitle": "Land information",
          "tasks": [
            {
              "title": "Add land ownership details",
              "status": "COMPLETED",
              "completedTaskUrl": "/land/ownership-proof-list",
              "startTaskUrl": "/land/upload-ownership-proof",
              "inProgressUrl": "",
              "id": "add-land-ownership"
            },
            {
              "title": "Add biodiversity gain site boundary details",
              "status": "COMPLETED",
              "completedTaskUrl": "/land/check-land-boundary-details",
              "startTaskUrl": "/land/choose-land-boundary-upload",
              "inProgressUrl": "/land/add-grid-reference",
              "id": "add-land-boundary"
            },
            {
              "title": "Add habitat baseline, creation and enhancements",
              "status": "COMPLETED",
              "completedTaskUrl": "/land/check-metric-details",
              "startTaskUrl": "/land/upload-metric",
              "inProgressUrl": "/land/check-metric-details",
              "id": "add-habitat-information"
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
    "metric-file-size": 4240880,
    "metric-file-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "metric-data": {
      "startPage": {
        "41": "",
        "planningAuthority": "TRAFFORD",
        "projectName": "Brentwood",
        "applicant": "GT",
        "applicationType": "Detailed ",
        "completedBy": "SB",
        "dateOfMetricCompletion": "10.04.2024",
        "calculationIteration": "v2",
        "targetNetGain": 0.1,
        "irreplaceableHabitatPresentAtBaseline": "No ✓",
        "totalSiteAreaIncludingIrreplaceableHabitatAreaHectares": 2.6469,
        "totalOffSiteAreaIncludingIrreplaceableHabitatAreaHectares": 1.324,
        "containsDeviationsFromTheStatutoryMetricThisMustBeAgreedWithConsentingBody": "",
        "⚠": "Attention required",
        "▲": "Input error/rules and principles not met",
        "onSiteBaselineMapReferenceNumber": "On-site post-intervention map reference number",
        "offSiteBaselineMapReferenceNumber": "Off-site post-intervention reference number",
        "cells": {
          "version": 4.1
        }
      },
      "d1": [
        {
          "Ref": 1,
          "Broad habitat": "Cropland",
          "Habitat type": "Cereal crops",
          "Area (hectares)": 1.324,
          "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
          "Total habitat units": 2.648,
          "Area enhanced": 0,
          "Off-site reference": 1,
          "Condition": "Condition Assessment N/A"
        },
        {
          "Habitat type": "Total habitat area",
          "Area (hectares)": 1.324,
          "Total habitat units": 2.648,
          "Area enhanced": 0
        }
      ],
      "d2": [
        {
          "Strategic significance": "Area/compensation not in local strategy/ no local strategy",
          "Delay in starting habitat creation (years)": 0,
          "Off-site reference": 1,
          "Broad habitat": "Grassland",
          "Proposed habitat": "Other neutral grassland",
          "Area (hectares)": 1.324,
          "Condition": "Good",
          "Habitat units delivered": 5.5630423862448,
          "Habitat created in advance (years)": 0
        },
        {
          "Proposed habitat": "Total habitat area",
          "Area (hectares)": 1.324,
          "Habitat units delivered": 5.5630423862448
        }
      ],
      "d3": [
        {
          "Condition change": "Total habitat area",
          "Area (hectares)": 0,
          "Habitat units delivered": 0
        }
      ],
      "e1": [
        {
          "Length (km)": 0,
          "Total hedgerow units": 0,
          "Length enhanced": 0
        }
      ],
      "e2": [
        {
          "Length (km)": 0,
          "Hedge units delivered": 0
        }
      ],
      "e3": [
        {
          "Length (km)": 0,
          "Hedge units delivered": 0
        }
      ],
      "f1": [
        {
          "Length (km)": 0,
          "Total watercourse units": 0,
          "Length enhanced": 0
        }
      ],
      "f2": [
        {
          "Length (km)": 0,
          "Watercourse units delivered": 0
        }
      ],
      "f3": [
        {
          "Length (km)": 0,
          "Watercourse units delivered": 0
        }
      ],
      "habitatOffSiteGainSiteSummary": [
        {
          "Gain site reference": 1,
          "Habitat Offsite unit change per gain site (Post SRM)": 4.2390423862448
        }
      ],
      "hedgeOffSiteGainSiteSummary": [],
      "waterCourseOffSiteGainSiteSummary": [],
      "validation": {
        "isMetricWorkbook": true,
        "isSupportedVersion": true,
        "isOffsiteDataPresent": true,
        "areOffsiteTotalsCorrect": true,
        "isDraftVersion": false
      }
    },
    "metric-file-checked": "yes",
    "check-uploaded-metric": true,
    "metric-habitat-baseline-checked": true,
    "metric-habitat-created-checked": true,
    "legal-agreement-type": "759150001",
    "legal-agreement-checked": "yes",
    "legal-agreement-file-option": "yes",
    "need-add-all-legal-files-checked": true,
    "legal-agreement-files": [
      {
        "location": "800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement.doc",
        "fileSize": 0.01,
        "fileType": "application/msword",
        "id": "1"
      },
      {
        "location": "800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement1.pdf",
        "fileSize": 0.01,
        "fileType": "application/pdf",
        "id": "2"
      }
    ],
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
    "need-add-all-responsible-bodies-checked": true,
    "responsible-bodies-checked": "yes",
    "legal-agreement-reponsible-bodies": [
      {
        "responsibleBodyName": "test1"
      },
      {
        "responsibleBodyName": "test2"
      }
    ],
    "planning-authority-list": [
      "County Durham LPA",
      "Secretary of State"
    ],
    "la-any-other-landowners-checked": "yes",
    "landowners-checked": "yes",
    "legal-agreement-landowner-conservation-convenants": [
      {
        "organisationName": "org1",
        "emailAddress": "me@me.com",
        "type": "organisation"
      },
      {
        "firstName": "Crishn",
        "lastName": "P",
        "emailAddress": "me@me.com",
        "type": "individual"
      }
    ],
    "habitat-plan-legal-agreement-document-included-yes-no": "Yes",
    "enhancement-works-start-date": "2022-01-01T00:00:00.000Z",
    "enhancement-works-start-date-option": "yes",
    "habitat-enhancements-end-date": "2023-01-01T00:00:00.000Z",
    "legal-agreement-end-date-option": "yes",
    "local-land-charge-location": "800376c7-8652-4906-8848-70a774578dfe/local-land-charge/local-land-charge.doc",
    "local-land-charge-file-size": 0.01,
    "local-land-charge-file-type": "application/msword",
    "local-land-charge-checked": "yes",
    "habitat-plan-file-option": "yes",
    "habitat-plan-file-size": 154703,
    "habitat-plan-file-type": "application/pdf",
    "habitat-plan-location": "800376c7-8652-4906-8848-70a774578dfe/habitat-plan/habitat-plan.doc",
    "habitat-plan-checked": "yes",
    "application-reference": "BNGREG-Y4S8C-AD9V2",
    "is-agent": "yes",
    "defra-account-details-confirmed": "true",
    "client-individual-organisation": "individual",
    "clients-name": {
      "type": "individual",
      "value": {
        "firstName": "test",
        "lastName": "test"
      }
    },
    "is-address-uk": "yes",
    "uk-address": {
      "addressLine1": "test",
      "addressLine2": "test",
      "town": "test",
      "county": "test",
      "postcode": "m11mm"
    },
    "clients-email-address": "test@Test.com",
    "clients-phone-number": "12323453453",
    "written-authorisation-location": "94c588fe-9242-43f2-a48c-926902a135e1/written-authorisation/legal-agreement.pdf",
    "written-authorisation-file-size": 7515,
    "written-authorisation-file-type": "application/pdf",
    "written-authorisation-checked": "yes",
    "landowner-type": "individual",
    "defraAccountDetailsConfirmed": "true",
    "land-ownership-proof-list-key": "yes",
    "land-ownership-proofs": [
      {
        "contentMediaType": "application/pdf",
        "fileType": "land-ownership",
        "fileSize": 13264,
        "fileLocation": "627560b8-cf81-4291-b640-2a2f91bd588b/land-ownership/lopfile2.pdf",
        "fileName": "lopfile2.pdf",
        "optional": false
      },
      {
        "contentMediaType": "application/pdf",
        "fileType": "land-ownership",
        "fileSize": 13264,
        "fileLocation": "627560b8-cf81-4291-b640-2a2f91bd588b/land-ownership/lopfile1.pdf",
        "fileName": "lopfile1.pdf",
        "optional": false
      }
    ],
    "landowner-individual-organisation-key": "individual",
    "legal-agreement-files-checked": "yes",
    "application-type": "CombinedCase",
    "save-application-session-on-signout-or-journey-change": true,
    "save-application-session-on-signout": true,
    "metric-file-location": "75e2ee81-1646-42c3-9fa2-47dba5cdda40/metric-upload/CC-DEV-BNGREG-M7T5N-BQ3Z4_Metric.xlsx"
  }`

export default {
  dataString
}
