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
      "completedBy": "Harrison Anton",
      "dateOfMetricCompletion": 45349,
      "targetNetGain": 0.1,
      "irreplaceableHabitatPresentAtBaseline": "No ✓",
      "totalSiteAreaIncludingIrreplaceableHabitatAreaHectares": 0,
      "totalOffSiteAreaIncludingIrreplaceableHabitatAreaHectares": 31.75,
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
        "Area (hectares)": 16.85,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 38.755,
        "Area enhanced": 0,
        "Off-site reference": 1,
        "rowNum": 11,
        "Condition": "Condition Assessment N/A"
      },
      {
        "Ref": 2,
        "Broad habitat": "Cropland",
        "Habitat type": "Cereal crops",
        "Area (hectares)": 10.86,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 24.977999999999998,
        "Area enhanced": 0,
        "Off-site reference": 1,
        "rowNum": 12,
        "Condition": "Condition Assessment N/A"
      },
      {
        "Ref": 3,
        "Broad habitat": "Grassland",
        "Habitat type": "Other neutral grassland",
        "Area (hectares)": 0.23,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 1.058,
        "Area enhanced": 0,
        "Off-site reference": 1,
        "rowNum": 13,
        "Condition": "Poor"
      },
      {
        "Ref": 4,
        "Broad habitat": "Grassland",
        "Habitat type": "Other neutral grassland",
        "Area (hectares)": 0.08,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 0.368,
        "Area enhanced": 0,
        "Off-site reference": 1,
        "rowNum": 14,
        "Condition": "Poor"
      },
      {
        "Ref": 5,
        "Broad habitat": "Grassland",
        "Habitat type": "Other neutral grassland",
        "Area (hectares)": 0.25,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 1.15,
        "Area enhanced": 0.25,
        "Off-site reference": 1,
        "rowNum": 15,
        "Condition": "Poor"
      },
      {
        "Ref": 6,
        "Broad habitat": "Heathland and shrub",
        "Habitat type": "Mixed scrub",
        "Area (hectares)": 0.61,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 5.611999999999999,
        "Area enhanced": 0.61,
        "Off-site reference": 1,
        "rowNum": 16,
        "Condition": "Moderate"
      },
      {
        "Ref": 7,
        "Broad habitat": "Heathland and shrub",
        "Habitat type": "Mixed scrub",
        "Area (hectares)": 0.24,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 2.2079999999999997,
        "Area enhanced": 0.24,
        "Off-site reference": 1,
        "rowNum": 17,
        "Condition": "Moderate"
      },
      {
        "Ref": 8,
        "Broad habitat": "Heathland and shrub",
        "Habitat type": "Mixed scrub",
        "Area (hectares)": 0.17,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 1.564,
        "Area enhanced": 0.17,
        "Off-site reference": 1,
        "rowNum": 18,
        "Condition": "Moderate"
      },
      {
        "Ref": 9,
        "Broad habitat": "Grassland",
        "Habitat type": "Other neutral grassland",
        "Area (hectares)": 0.53,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 2.4379999999999997,
        "Area enhanced": 0.53,
        "Off-site reference": 1,
        "rowNum": 19,
        "Condition": "Poor"
      },
      {
        "Ref": 10,
        "Broad habitat": "Heathland and shrub",
        "Habitat type": "Mixed scrub",
        "Area (hectares)": 1.65,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 15.179999999999998,
        "Area enhanced": 1.65,
        "Off-site reference": 1,
        "rowNum": 20,
        "Condition": "Moderate"
      },
      {
        "Ref": 11,
        "Broad habitat": "Woodland and forest",
        "Habitat type": "Lowland mixed deciduous woodland",
        "Area (hectares)": 0.28,
        "Strategic significance": "Formally identified in local strategy",
        "Total habitat units": 3.864,
        "Area enhanced": 0.28,
        "Off-site reference": 1,
        "rowNum": 21,
        "Condition": "Moderate"
      },
      {
        "Ref": 12,
        "Total habitat units": "",
        "Off-site reference": 1,
        "rowNum": 22
      },
      {
        "Ref": 13,
        "Total habitat units": "",
        "rowNum": 23
      },
      {
        "Ref": 14,
        "Total habitat units": "",
        "rowNum": 24
      },
      {
        "Ref": 15,
        "Total habitat units": "",
        "rowNum": 25
      },
      {
        "Ref": 16,
        "Total habitat units": "",
        "rowNum": 26
      },
      {
        "Ref": 17,
        "Total habitat units": "",
        "rowNum": 27
      },
      {
        "Ref": 18,
        "Total habitat units": "",
        "rowNum": 28
      },
      {
        "Ref": 19,
        "Total habitat units": "",
        "rowNum": 29
      },
      {
        "Ref": 20,
        "Total habitat units": "",
        "rowNum": 30
      },
      {
        "Ref": 21,
        "Total habitat units": "",
        "rowNum": 31
      },
      {
        "Ref": 22,
        "Total habitat units": "",
        "rowNum": 32
      },
      {
        "Ref": 23,
        "Total habitat units": "",
        "rowNum": 33
      },
      {
        "Ref": 24,
        "Total habitat units": "",
        "rowNum": 34
      },
      {
        "Ref": 25,
        "Total habitat units": "",
        "rowNum": 35
      },
      {
        "Ref": 26,
        "Total habitat units": "",
        "rowNum": 36
      },
      {
        "Ref": 27,
        "Total habitat units": "",
        "rowNum": 37
      },
      {
        "Ref": 28,
        "Total habitat units": "",
        "rowNum": 38
      },
      {
        "Ref": 29,
        "Total habitat units": "",
        "rowNum": 39
      },
      {
        "Ref": 30,
        "Total habitat units": "",
        "rowNum": 40
      },
      {
        "Ref": 31,
        "Total habitat units": "",
        "rowNum": 41
      },
      {
        "Ref": 32,
        "Total habitat units": "",
        "rowNum": 42
      },
      {
        "Ref": 33,
        "Total habitat units": "",
        "rowNum": 43
      },
      {
        "Ref": 34,
        "Total habitat units": "",
        "rowNum": 44
      },
      {
        "Ref": 35,
        "Total habitat units": "",
        "rowNum": 45
      },
      {
        "Ref": 36,
        "Total habitat units": "",
        "rowNum": 46
      },
      {
        "Ref": 37,
        "Total habitat units": "",
        "rowNum": 47
      },
      {
        "Ref": 38,
        "Total habitat units": "",
        "rowNum": 48
      },
      {
        "Ref": 39,
        "Total habitat units": "",
        "rowNum": 49
      },
      {
        "Ref": 40,
        "Total habitat units": "",
        "rowNum": 50
      },
      {
        "Ref": 41,
        "Total habitat units": "",
        "rowNum": 51
      },
      {
        "Ref": 42,
        "Total habitat units": "",
        "rowNum": 52
      },
      {
        "Ref": 43,
        "Total habitat units": "",
        "rowNum": 53
      },
      {
        "Ref": 44,
        "Total habitat units": "",
        "rowNum": 54
      },
      {
        "Ref": 45,
        "Total habitat units": "",
        "rowNum": 55
      },
      {
        "Ref": 46,
        "Total habitat units": "",
        "rowNum": 56
      },
      {
        "Ref": 47,
        "Total habitat units": "",
        "rowNum": 57
      },
      {
        "Ref": 48,
        "Total habitat units": "",
        "rowNum": 58
      },
      {
        "Ref": 49,
        "Total habitat units": "",
        "rowNum": 59
      },
      {
        "Ref": 50,
        "Total habitat units": "",
        "rowNum": 60
      },
      {
        "Ref": 51,
        "Total habitat units": "",
        "rowNum": 61
      },
      {
        "Ref": 52,
        "Total habitat units": "",
        "rowNum": 62
      },
      {
        "Ref": 53,
        "Total habitat units": "",
        "rowNum": 63
      },
      {
        "Ref": 54,
        "Total habitat units": "",
        "rowNum": 64
      },
      {
        "Ref": 55,
        "Total habitat units": "",
        "rowNum": 65
      },
      {
        "Ref": 56,
        "Total habitat units": "",
        "rowNum": 66
      },
      {
        "Ref": 57,
        "Total habitat units": "",
        "rowNum": 67
      },
      {
        "Ref": 58,
        "Total habitat units": "",
        "rowNum": 68
      },
      {
        "Ref": 59,
        "Total habitat units": "",
        "rowNum": 69
      },
      {
        "Ref": 60,
        "Total habitat units": "",
        "rowNum": 70
      },
      {
        "Ref": 61,
        "Total habitat units": "",
        "rowNum": 71
      },
      {
        "Ref": 62,
        "Total habitat units": "",
        "rowNum": 72
      },
      {
        "Ref": 63,
        "Total habitat units": "",
        "rowNum": 73
      },
      {
        "Ref": 64,
        "Total habitat units": "",
        "rowNum": 74
      },
      {
        "Ref": 65,
        "Total habitat units": "",
        "rowNum": 75
      },
      {
        "Ref": 66,
        "Total habitat units": "",
        "rowNum": 76
      },
      {
        "Ref": 67,
        "Total habitat units": "",
        "rowNum": 77
      },
      {
        "Ref": 68,
        "Total habitat units": "",
        "rowNum": 78
      },
      {
        "Ref": 69,
        "Total habitat units": "",
        "rowNum": 79
      },
      {
        "Ref": 70,
        "Total habitat units": "",
        "rowNum": 80
      },
      {
        "Ref": 71,
        "Total habitat units": "",
        "rowNum": 81
      },
      {
        "Ref": 72,
        "Total habitat units": "",
        "rowNum": 82
      },
      {
        "Ref": 73,
        "Total habitat units": "",
        "rowNum": 83
      },
      {
        "Ref": 74,
        "Total habitat units": "",
        "rowNum": 84
      },
      {
        "Ref": 75,
        "Total habitat units": "",
        "rowNum": 85
      },
      {
        "Ref": 76,
        "Total habitat units": "",
        "rowNum": 86
      },
      {
        "Ref": 77,
        "Total habitat units": "",
        "rowNum": 87
      },
      {
        "Ref": 78,
        "Total habitat units": "",
        "rowNum": 88
      },
      {
        "Ref": 79,
        "Total habitat units": "",
        "rowNum": 89
      },
      {
        "Ref": 80,
        "Total habitat units": "",
        "rowNum": 90
      },
      {
        "Ref": 81,
        "Total habitat units": "",
        "rowNum": 91
      },
      {
        "Ref": 82,
        "Total habitat units": "",
        "rowNum": 92
      },
      {
        "Ref": 83,
        "Total habitat units": "",
        "rowNum": 93
      },
      {
        "Ref": 84,
        "Total habitat units": "",
        "rowNum": 94
      },
      {
        "Ref": 85,
        "Total habitat units": "",
        "rowNum": 95
      },
      {
        "Ref": 86,
        "Total habitat units": "",
        "rowNum": 96
      },
      {
        "Ref": 87,
        "Total habitat units": "",
        "rowNum": 97
      },
      {
        "Ref": 88,
        "Total habitat units": "",
        "rowNum": 98
      },
      {
        "Ref": 89,
        "Total habitat units": "",
        "rowNum": 99
      },
      {
        "Ref": 90,
        "Total habitat units": "",
        "rowNum": 100
      },
      {
        "Ref": 91,
        "Total habitat units": "",
        "rowNum": 101
      },
      {
        "Ref": 92,
        "Total habitat units": "",
        "rowNum": 102
      },
      {
        "Ref": 93,
        "Total habitat units": "",
        "rowNum": 103
      },
      {
        "Ref": 94,
        "Total habitat units": "",
        "rowNum": 104
      },
      {
        "Ref": 95,
        "Total habitat units": "",
        "rowNum": 105
      },
      {
        "Ref": 96,
        "Total habitat units": "",
        "rowNum": 106
      },
      {
        "Ref": 97,
        "Total habitat units": "",
        "rowNum": 107
      },
      {
        "Ref": 98,
        "Total habitat units": "",
        "rowNum": 108
      },
      {
        "Ref": 99,
        "Total habitat units": "",
        "rowNum": 109
      },
      {
        "Ref": 100,
        "Total habitat units": "",
        "rowNum": 110
      },
      {
        "Ref": 101,
        "Total habitat units": "",
        "rowNum": 111
      },
      {
        "Ref": 102,
        "Total habitat units": "",
        "rowNum": 112
      },
      {
        "Ref": 103,
        "Total habitat units": "",
        "rowNum": 113
      },
      {
        "Ref": 104,
        "Total habitat units": "",
        "rowNum": 114
      },
      {
        "Ref": 105,
        "Total habitat units": "",
        "rowNum": 115
      },
      {
        "Ref": 106,
        "Total habitat units": "",
        "rowNum": 116
      },
      {
        "Ref": 107,
        "Total habitat units": "",
        "rowNum": 117
      },
      {
        "Ref": 108,
        "Total habitat units": "",
        "rowNum": 118
      },
      {
        "Ref": 109,
        "Total habitat units": "",
        "rowNum": 119
      },
      {
        "Ref": 110,
        "Total habitat units": "",
        "rowNum": 120
      },
      {
        "Ref": 111,
        "Total habitat units": "",
        "rowNum": 121
      },
      {
        "Ref": 112,
        "Total habitat units": "",
        "rowNum": 122
      },
      {
        "Ref": 113,
        "Total habitat units": "",
        "rowNum": 123
      },
      {
        "Ref": 114,
        "Total habitat units": "",
        "rowNum": 124
      },
      {
        "Ref": 115,
        "Total habitat units": "",
        "rowNum": 125
      },
      {
        "Ref": 116,
        "Total habitat units": "",
        "rowNum": 126
      },
      {
        "Ref": 117,
        "Total habitat units": "",
        "rowNum": 127
      },
      {
        "Ref": 118,
        "Total habitat units": "",
        "rowNum": 128
      },
      {
        "Ref": 119,
        "Total habitat units": "",
        "rowNum": 129
      },
      {
        "Ref": 120,
        "Total habitat units": "",
        "rowNum": 130
      },
      {
        "Ref": 121,
        "Total habitat units": "",
        "rowNum": 131
      },
      {
        "Ref": 122,
        "Total habitat units": "",
        "rowNum": 132
      },
      {
        "Ref": 123,
        "Total habitat units": "",
        "rowNum": 133
      },
      {
        "Ref": 124,
        "Total habitat units": "",
        "rowNum": 134
      },
      {
        "Ref": 125,
        "Total habitat units": "",
        "rowNum": 135
      },
      {
        "Ref": 126,
        "Total habitat units": "",
        "rowNum": 136
      },
      {
        "Ref": 127,
        "Total habitat units": "",
        "rowNum": 137
      },
      {
        "Ref": 128,
        "Total habitat units": "",
        "rowNum": 138
      },
      {
        "Ref": 129,
        "Total habitat units": "",
        "rowNum": 139
      },
      {
        "Ref": 130,
        "Total habitat units": "",
        "rowNum": 140
      },
      {
        "Ref": 131,
        "Total habitat units": "",
        "rowNum": 141
      },
      {
        "Ref": 132,
        "Total habitat units": "",
        "rowNum": 142
      },
      {
        "Ref": 133,
        "Total habitat units": "",
        "rowNum": 143
      },
      {
        "Ref": 134,
        "Total habitat units": "",
        "rowNum": 144
      },
      {
        "Ref": 135,
        "Total habitat units": "",
        "rowNum": 145
      },
      {
        "Ref": 136,
        "Total habitat units": "",
        "rowNum": 146
      },
      {
        "Ref": 137,
        "Total habitat units": "",
        "rowNum": 147
      },
      {
        "Ref": 138,
        "Total habitat units": "",
        "rowNum": 148
      },
      {
        "Ref": 139,
        "Total habitat units": "",
        "rowNum": 149
      },
      {
        "Ref": 140,
        "Total habitat units": "",
        "rowNum": 150
      },
      {
        "Ref": 141,
        "Total habitat units": "",
        "rowNum": 151
      },
      {
        "Ref": 142,
        "Total habitat units": "",
        "rowNum": 152
      },
      {
        "Ref": 143,
        "Total habitat units": "",
        "rowNum": 153
      },
      {
        "Ref": 144,
        "Total habitat units": "",
        "rowNum": 154
      },
      {
        "Ref": 145,
        "Total habitat units": "",
        "rowNum": 155
      },
      {
        "Ref": 146,
        "Total habitat units": "",
        "rowNum": 156
      },
      {
        "Ref": 147,
        "Total habitat units": "",
        "rowNum": 157
      },
      {
        "Ref": 148,
        "Total habitat units": "",
        "rowNum": 158
      },
      {
        "Ref": 149,
        "Total habitat units": "",
        "rowNum": 159
      },
      {
        "Ref": 150,
        "Total habitat units": "",
        "rowNum": 160
      },
      {
        "Ref": 151,
        "Total habitat units": "",
        "rowNum": 161
      },
      {
        "Ref": 152,
        "Total habitat units": "",
        "rowNum": 162
      },
      {
        "Ref": 153,
        "Total habitat units": "",
        "rowNum": 163
      },
      {
        "Ref": 154,
        "Total habitat units": "",
        "rowNum": 164
      },
      {
        "Ref": 155,
        "Total habitat units": "",
        "rowNum": 165
      },
      {
        "Ref": 156,
        "Total habitat units": "",
        "rowNum": 166
      },
      {
        "Ref": 157,
        "Total habitat units": "",
        "rowNum": 167
      },
      {
        "Ref": 158,
        "Total habitat units": "",
        "rowNum": 168
      },
      {
        "Ref": 159,
        "Total habitat units": "",
        "rowNum": 169
      },
      {
        "Ref": 160,
        "Total habitat units": "",
        "rowNum": 170
      },
      {
        "Ref": 161,
        "Total habitat units": "",
        "rowNum": 171
      },
      {
        "Ref": 162,
        "Total habitat units": "",
        "rowNum": 172
      },
      {
        "Ref": 163,
        "Total habitat units": "",
        "rowNum": 173
      },
      {
        "Ref": 164,
        "Total habitat units": "",
        "rowNum": 174
      },
      {
        "Ref": 165,
        "Total habitat units": "",
        "rowNum": 175
      },
      {
        "Ref": 166,
        "Total habitat units": "",
        "rowNum": 176
      },
      {
        "Ref": 167,
        "Total habitat units": "",
        "rowNum": 177
      },
      {
        "Ref": 168,
        "Total habitat units": "",
        "rowNum": 178
      },
      {
        "Ref": 169,
        "Total habitat units": "",
        "rowNum": 179
      },
      {
        "Ref": 170,
        "Total habitat units": "",
        "rowNum": 180
      },
      {
        "Ref": 171,
        "Total habitat units": "",
        "rowNum": 181
      },
      {
        "Ref": 172,
        "Total habitat units": "",
        "rowNum": 182
      },
      {
        "Ref": 173,
        "Total habitat units": "",
        "rowNum": 183
      },
      {
        "Ref": 174,
        "Total habitat units": "",
        "rowNum": 184
      },
      {
        "Ref": 175,
        "Total habitat units": "",
        "rowNum": 185
      },
      {
        "Ref": 176,
        "Total habitat units": "",
        "rowNum": 186
      },
      {
        "Ref": 177,
        "Total habitat units": "",
        "rowNum": 187
      },
      {
        "Ref": 178,
        "Total habitat units": "",
        "rowNum": 188
      },
      {
        "Ref": 179,
        "Total habitat units": "",
        "rowNum": 189
      },
      {
        "Ref": 180,
        "Total habitat units": "",
        "rowNum": 190
      },
      {
        "Ref": 181,
        "Total habitat units": "",
        "rowNum": 191
      },
      {
        "Ref": 182,
        "Total habitat units": "",
        "rowNum": 192
      },
      {
        "Ref": 183,
        "Total habitat units": "",
        "rowNum": 193
      },
      {
        "Ref": 184,
        "Total habitat units": "",
        "rowNum": 194
      },
      {
        "Ref": 185,
        "Total habitat units": "",
        "rowNum": 195
      },
      {
        "Ref": 186,
        "Total habitat units": "",
        "rowNum": 196
      },
      {
        "Ref": 187,
        "Total habitat units": "",
        "rowNum": 197
      },
      {
        "Ref": 188,
        "Total habitat units": "",
        "rowNum": 198
      },
      {
        "Ref": 189,
        "Total habitat units": "",
        "rowNum": 199
      },
      {
        "Ref": 190,
        "Total habitat units": "",
        "rowNum": 200
      },
      {
        "Ref": 191,
        "Total habitat units": "",
        "rowNum": 201
      },
      {
        "Ref": 192,
        "Total habitat units": "",
        "rowNum": 202
      },
      {
        "Ref": 193,
        "Total habitat units": "",
        "rowNum": 203
      },
      {
        "Ref": 194,
        "Total habitat units": "",
        "rowNum": 204
      },
      {
        "Ref": 195,
        "Total habitat units": "",
        "rowNum": 205
      },
      {
        "Ref": 196,
        "Total habitat units": "",
        "rowNum": 206
      },
      {
        "Ref": 197,
        "Total habitat units": "",
        "rowNum": 207
      },
      {
        "Ref": 198,
        "Total habitat units": "",
        "rowNum": 208
      },
      {
        "Ref": 199,
        "Total habitat units": "",
        "rowNum": 209
      },
      {
        "Ref": 200,
        "Total habitat units": "",
        "rowNum": 210
      },
      {
        "Ref": 201,
        "Total habitat units": "",
        "rowNum": 211
      },
      {
        "Ref": 202,
        "Total habitat units": "",
        "rowNum": 212
      },
      {
        "Ref": 203,
        "Total habitat units": "",
        "rowNum": 213
      },
      {
        "Ref": 204,
        "Total habitat units": "",
        "rowNum": 214
      },
      {
        "Ref": 205,
        "Total habitat units": "",
        "rowNum": 215
      },
      {
        "Ref": 206,
        "Total habitat units": "",
        "rowNum": 216
      },
      {
        "Ref": 207,
        "Total habitat units": "",
        "rowNum": 217
      },
      {
        "Ref": 208,
        "Total habitat units": "",
        "rowNum": 218
      },
      {
        "Ref": 209,
        "Total habitat units": "",
        "rowNum": 219
      },
      {
        "Ref": 210,
        "Total habitat units": "",
        "rowNum": 220
      },
      {
        "Ref": 211,
        "Total habitat units": "",
        "rowNum": 221
      },
      {
        "Ref": 212,
        "Total habitat units": "",
        "rowNum": 222
      },
      {
        "Ref": 213,
        "Total habitat units": "",
        "rowNum": 223
      },
      {
        "Ref": 214,
        "Total habitat units": "",
        "rowNum": 224
      },
      {
        "Ref": 215,
        "Total habitat units": "",
        "rowNum": 225
      },
      {
        "Ref": 216,
        "Total habitat units": "",
        "rowNum": 226
      },
      {
        "Ref": 217,
        "Total habitat units": "",
        "rowNum": 227
      },
      {
        "Ref": 218,
        "Total habitat units": "",
        "rowNum": 228
      },
      {
        "Ref": 219,
        "Total habitat units": "",
        "rowNum": 229
      },
      {
        "Ref": 220,
        "Total habitat units": "",
        "rowNum": 230
      },
      {
        "Ref": 221,
        "Total habitat units": "",
        "rowNum": 231
      },
      {
        "Ref": 222,
        "Total habitat units": "",
        "rowNum": 232
      },
      {
        "Ref": 223,
        "Total habitat units": "",
        "rowNum": 233
      },
      {
        "Ref": 224,
        "Total habitat units": "",
        "rowNum": 234
      },
      {
        "Ref": 225,
        "Total habitat units": "",
        "rowNum": 235
      },
      {
        "Ref": 226,
        "Total habitat units": "",
        "rowNum": 236
      },
      {
        "Ref": 227,
        "Total habitat units": "",
        "rowNum": 237
      },
      {
        "Ref": 228,
        "Total habitat units": "",
        "rowNum": 238
      },
      {
        "Ref": 229,
        "Total habitat units": "",
        "rowNum": 239
      },
      {
        "Ref": 230,
        "Total habitat units": "",
        "rowNum": 240
      },
      {
        "Ref": 231,
        "Total habitat units": "",
        "rowNum": 241
      },
      {
        "Ref": 232,
        "Total habitat units": "",
        "rowNum": 242
      },
      {
        "Ref": 233,
        "Total habitat units": "",
        "rowNum": 243
      },
      {
        "Ref": 234,
        "Total habitat units": "",
        "rowNum": 244
      },
      {
        "Ref": 235,
        "Total habitat units": "",
        "rowNum": 245
      },
      {
        "Ref": 236,
        "Total habitat units": "",
        "rowNum": 246
      },
      {
        "Ref": 237,
        "Total habitat units": "",
        "rowNum": 247
      },
      {
        "Ref": 238,
        "Total habitat units": "",
        "rowNum": 248
      },
      {
        "Ref": 239,
        "Total habitat units": "",
        "rowNum": 249
      },
      {
        "Ref": 240,
        "Total habitat units": "",
        "rowNum": 250
      },
      {
        "Ref": 241,
        "Total habitat units": "",
        "rowNum": 251
      },
      {
        "Ref": 242,
        "Total habitat units": "",
        "rowNum": 252
      },
      {
        "Ref": 243,
        "Total habitat units": "",
        "rowNum": 253
      },
      {
        "Ref": 244,
        "Total habitat units": "",
        "rowNum": 254
      },
      {
        "Ref": 245,
        "Total habitat units": "",
        "rowNum": 255
      },
      {
        "Ref": 246,
        "Total habitat units": "",
        "rowNum": 256
      },
      {
        "Ref": 247,
        "Total habitat units": "",
        "rowNum": 257
      },
      {
        "Ref": 248,
        "Total habitat units": "",
        "rowNum": 258
      },
      {
        "Habitat type": "Total habitat area",
        "Area (hectares)": 31.75,
        "Total habitat units": 97.17500000000001,
        "Area enhanced": 3.7300000000000004,
        "rowNum": 259
      }
    ],
    "d2": [
      {
        "Strategic significance": "Formally identified in local strategy",
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": 1,
        "rowNum": 11,
        "Broad habitat": "Grassland",
        "Proposed habitat": "Other neutral grassland",
        "Area (hectares)": 15.01,
        "Condition": "Good",
        "Habitat units delivered": 145.05506971323956,
        "Habitat created in advance (years)": 0,
        "Habitat reference Number": "HAB-00001096-BD6X3"
      },
      {
        "Strategic significance": "Formally identified in local strategy",
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": 1,
        "rowNum": 12,
        "Broad habitat": "Grassland",
        "Proposed habitat": "Other neutral grassland",
        "Area (hectares)": 8.97,
        "Condition": "Good",
        "Habitat units delivered": 86.68514159412119,
        "Habitat created in advance (years)": 0,
        "Habitat reference Number": "HAB-00001097-BH1F9"
      },
      {
        "Strategic significance": "Formally identified in local strategy",
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": 1,
        "rowNum": 13,
        "Broad habitat": "Heathland and shrub",
        "Proposed habitat": "Mixed scrub",
        "Area (hectares)": 1.84,
        "Condition": "Good",
        "Habitat units delivered": 17.781567506486397,
        "Habitat created in advance (years)": 0,
        "Habitat reference Number": "HAB-00001098-BR6J2"
      },
      {
        "Strategic significance": "Formally identified in local strategy",
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": 1,
        "rowNum": 14,
        "Broad habitat": "Heathland and shrub",
        "Proposed habitat": "Mixed scrub",
        "Area (hectares)": 0.23,
        "Condition": "Good",
        "Habitat units delivered": 2.2226959383107996,
        "Habitat created in advance (years)": 0,
        "Habitat reference Number": "HAB-00001099-BH5R2"
      },
      {
        "Strategic significance": "Formally identified in local strategy",
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": 1,
        "rowNum": 15,
        "Broad habitat": "Heathland and shrub",
        "Proposed habitat": "Mixed scrub",
        "Area (hectares)": 0.08,
        "Condition": "Good",
        "Habitat units delivered": 0.7731116307167998,
        "Habitat created in advance (years)": 0,
        "Habitat reference Number": "HAB-00001101-BC8Q6"
      },
      {
        "Strategic significance": "Formally identified in local strategy",
        "Delay in starting habitat creation (years)": 0,
        "Off-site reference": 1,
        "rowNum": 16,
        "Broad habitat": "Heathland and shrub",
        "Proposed habitat": "Mixed scrub",
        "Area (hectares)": 1.89,
        "Condition": "Good",
        "Habitat units delivered": 18.264762275684394,
        "Habitat created in advance (years)": 0,
        "Habitat reference Number": "HAB-00001102-BG8B6"
      },
      {
        "rowNum": 257,
        "Proposed habitat": "Total habitat area",
        "Area (hectares)": 28.02,
        "Habitat units delivered": 270.78234865855916
      }
    ],
    "d3": [
      {
        "Baseline ref": 5,
        "Baseline habitat": "Grassland - Other neutral grassland",
        "Total habitat area (hectares)": 0.25,
        "Proposed Broad Habitat": "Grassland",
        "Condition change": "Poor - Good",
        "Strategic significance": "Formally identified in local strategy",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": 1,
        "rowNum": 12,
        "Area (hectares)": 0.25,
        "Condition": "Good",
        "Habitat units delivered": 2.49783750265,
        "Proposed habitat": "Other neutral grassland",
        "Distinctiveness change": "Medium - Medium",
        "Habitat reference Number": "HAB-00001088-BM6P4"
      },
      {
        "Baseline ref": 6,
        "Baseline habitat": "Heathland and shrub - Mixed scrub",
        "Total habitat area (hectares)": 0.61,
        "Proposed Broad Habitat": "Heathland and shrub",
        "Condition change": "Moderate - Good",
        "Strategic significance": "Formally identified in local strategy",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": 1,
        "rowNum": 13,
        "Area (hectares)": 0.61,
        "Condition": "Good",
        "Habitat units delivered": 8.133561742749999,
        "Proposed habitat": "Mixed scrub",
        "Distinctiveness change": "Medium - Medium",
        "Habitat reference Number": "HAB-00001089-BL8V1"
      },
      {
        "Baseline ref": 7,
        "Baseline habitat": "Heathland and shrub - Mixed scrub",
        "Total habitat area (hectares)": 0.24,
        "Proposed Broad Habitat": "Heathland and shrub",
        "Condition change": "Moderate - Good",
        "Strategic significance": "Formally identified in local strategy",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": 1,
        "rowNum": 14,
        "Area (hectares)": 0.24,
        "Condition": "Good",
        "Habitat units delivered": 3.2000898659999994,
        "Proposed habitat": "Mixed scrub",
        "Distinctiveness change": "Medium - Medium",
        "Habitat reference Number": "HAB-00001090-BN3D7"
      },
      {
        "Baseline ref": 8,
        "Baseline habitat": "Heathland and shrub - Mixed scrub",
        "Total habitat area (hectares)": 0.17,
        "Proposed Broad Habitat": "Heathland and shrub",
        "Condition change": "Moderate - Good",
        "Strategic significance": "Formally identified in local strategy",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": 1,
        "rowNum": 15,
        "Area (hectares)": 0.17,
        "Condition": "Good",
        "Habitat units delivered": 2.26673032175,
        "Proposed habitat": "Mixed scrub",
        "Distinctiveness change": "Medium - Medium",
        "Habitat reference Number": "HAB-00001091-BS6M9"
      },
      {
        "Baseline ref": 9,
        "Baseline habitat": "Grassland - Other neutral grassland",
        "Total habitat area (hectares)": 0.53,
        "Proposed Broad Habitat": "Grassland",
        "Condition change": "Poor - Good",
        "Strategic significance": "Formally identified in local strategy",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": 1,
        "rowNum": 16,
        "Area (hectares)": 0.53,
        "Condition": "Good",
        "Habitat units delivered": 5.295415505618,
        "Proposed habitat": "Other neutral grassland",
        "Distinctiveness change": "Medium - Medium",
        "Habitat reference Number": "HAB-00001092-BQ4V1"
      },
      {
        "Baseline ref": 10,
        "Baseline habitat": "Heathland and shrub - Mixed scrub",
        "Total habitat area (hectares)": 1.65,
        "Proposed Broad Habitat": "Heathland and shrub",
        "Condition change": "Moderate - Good",
        "Strategic significance": "Formally identified in local strategy",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": 1,
        "rowNum": 17,
        "Area (hectares)": 1.65,
        "Condition": "Good",
        "Habitat units delivered": 22.000617828749995,
        "Proposed habitat": "Mixed scrub",
        "Distinctiveness change": "Medium - Medium",
        "Habitat reference Number": "HAB-00001093-BG9D4"
      },
      {
        "Baseline ref": 11,
        "Baseline habitat": "Woodland and forest - Lowland mixed deciduous woodland",
        "Total habitat area (hectares)": 0.28,
        "Proposed Broad Habitat": "Woodland and forest",
        "Condition change": "Moderate - Good",
        "Strategic significance": "Formally identified in local strategy",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": 1,
        "rowNum": 18,
        "Area (hectares)": 0.28,
        "Condition": "Good",
        "Habitat units delivered": 4.17665640419706,
        "Proposed habitat": "Lowland mixed deciduous woodland",
        "Distinctiveness change": "High - High",
        "Habitat reference Number": "HAB-00001094-BC5D8"
      },
      {
        "Condition change": "Total habitat area",
        "rowNum": 259,
        "Area (hectares)": 3.7300000000000004,
        "Habitat units delivered": 47.57090917171506
      }
    ],
    "e1": [
      {
        "Ref": 1,
        "Hedge number": "H1",
        "Habitat type": "Native hedgerow",
        "Length (km)": 0.933,
        "Strategic significance": "Formally identified in local strategy",
        "Total hedgerow units": 4.2918,
        "Length enhanced": 0.933,
        "Off-site reference": 1,
        "rowNum": 10,
        "Condition": "Moderate"
      },
      {
        "Ref": 2,
        "Total hedgerow units": "",
        "rowNum": 11
      },
      {
        "Ref": 3,
        "Total hedgerow units": "",
        "rowNum": 12
      },
      {
        "Ref": 4,
        "Total hedgerow units": "",
        "rowNum": 13
      },
      {
        "Ref": 5,
        "Total hedgerow units": "",
        "rowNum": 14
      },
      {
        "Ref": 6,
        "Total hedgerow units": "",
        "rowNum": 15
      },
      {
        "Ref": 7,
        "Total hedgerow units": "",
        "rowNum": 16
      },
      {
        "Ref": 8,
        "Total hedgerow units": "",
        "rowNum": 17
      },
      {
        "Ref": 9,
        "Total hedgerow units": "",
        "rowNum": 18
      },
      {
        "Ref": 10,
        "Total hedgerow units": "",
        "rowNum": 19
      },
      {
        "Ref": 11,
        "Total hedgerow units": "",
        "rowNum": 20
      },
      {
        "Ref": 12,
        "Total hedgerow units": "",
        "rowNum": 21
      },
      {
        "Ref": 13,
        "Total hedgerow units": "",
        "rowNum": 22
      },
      {
        "Ref": 14,
        "Total hedgerow units": "",
        "rowNum": 23
      },
      {
        "Ref": 15,
        "Total hedgerow units": "",
        "rowNum": 24
      },
      {
        "Ref": 16,
        "Total hedgerow units": "",
        "rowNum": 25
      },
      {
        "Ref": 17,
        "Total hedgerow units": "",
        "rowNum": 26
      },
      {
        "Ref": 18,
        "Total hedgerow units": "",
        "rowNum": 27
      },
      {
        "Ref": 19,
        "Total hedgerow units": "",
        "rowNum": 28
      },
      {
        "Ref": 20,
        "Total hedgerow units": "",
        "rowNum": 29
      },
      {
        "Ref": 21,
        "Total hedgerow units": "",
        "rowNum": 30
      },
      {
        "Ref": 22,
        "Total hedgerow units": "",
        "rowNum": 31
      },
      {
        "Ref": 23,
        "Total hedgerow units": "",
        "rowNum": 32
      },
      {
        "Ref": 24,
        "Total hedgerow units": "",
        "rowNum": 33
      },
      {
        "Ref": 25,
        "Total hedgerow units": "",
        "rowNum": 34
      },
      {
        "Ref": 26,
        "Total hedgerow units": "",
        "rowNum": 35
      },
      {
        "Ref": 27,
        "Total hedgerow units": "",
        "rowNum": 36
      },
      {
        "Ref": 28,
        "Total hedgerow units": "",
        "rowNum": 37
      },
      {
        "Ref": 29,
        "Total hedgerow units": "",
        "rowNum": 38
      },
      {
        "Ref": 30,
        "Total hedgerow units": "",
        "rowNum": 39
      },
      {
        "Ref": 31,
        "Total hedgerow units": "",
        "rowNum": 40
      },
      {
        "Ref": 32,
        "Total hedgerow units": "",
        "rowNum": 41
      },
      {
        "Ref": 33,
        "Total hedgerow units": "",
        "rowNum": 42
      },
      {
        "Ref": 34,
        "Total hedgerow units": "",
        "rowNum": 43
      },
      {
        "Ref": 35,
        "Total hedgerow units": "",
        "rowNum": 44
      },
      {
        "Ref": 36,
        "Total hedgerow units": "",
        "rowNum": 45
      },
      {
        "Ref": 37,
        "Total hedgerow units": "",
        "rowNum": 46
      },
      {
        "Ref": 38,
        "Total hedgerow units": "",
        "rowNum": 47
      },
      {
        "Ref": 39,
        "Total hedgerow units": "",
        "rowNum": 48
      },
      {
        "Ref": 40,
        "Total hedgerow units": "",
        "rowNum": 49
      },
      {
        "Ref": 41,
        "Total hedgerow units": "",
        "rowNum": 50
      },
      {
        "Ref": 42,
        "Total hedgerow units": "",
        "rowNum": 51
      },
      {
        "Ref": 43,
        "Total hedgerow units": "",
        "rowNum": 52
      },
      {
        "Ref": 44,
        "Total hedgerow units": "",
        "rowNum": 53
      },
      {
        "Ref": 45,
        "Total hedgerow units": "",
        "rowNum": 54
      },
      {
        "Ref": 46,
        "Total hedgerow units": "",
        "rowNum": 55
      },
      {
        "Ref": 47,
        "Total hedgerow units": "",
        "rowNum": 56
      },
      {
        "Ref": 48,
        "Total hedgerow units": "",
        "rowNum": 57
      },
      {
        "Ref": 49,
        "Total hedgerow units": "",
        "rowNum": 58
      },
      {
        "Ref": 50,
        "Total hedgerow units": "",
        "rowNum": 59
      },
      {
        "Ref": 51,
        "Total hedgerow units": "",
        "rowNum": 60
      },
      {
        "Ref": 52,
        "Total hedgerow units": "",
        "rowNum": 61
      },
      {
        "Ref": 53,
        "Total hedgerow units": "",
        "rowNum": 62
      },
      {
        "Ref": 54,
        "Total hedgerow units": "",
        "rowNum": 63
      },
      {
        "Ref": 55,
        "Total hedgerow units": "",
        "rowNum": 64
      },
      {
        "Ref": 56,
        "Total hedgerow units": "",
        "rowNum": 65
      },
      {
        "Ref": 57,
        "Total hedgerow units": "",
        "rowNum": 66
      },
      {
        "Ref": 58,
        "Total hedgerow units": "",
        "rowNum": 67
      },
      {
        "Ref": 59,
        "Total hedgerow units": "",
        "rowNum": 68
      },
      {
        "Ref": 60,
        "Total hedgerow units": "",
        "rowNum": 69
      },
      {
        "Ref": 61,
        "Total hedgerow units": "",
        "rowNum": 70
      },
      {
        "Ref": 62,
        "Total hedgerow units": "",
        "rowNum": 71
      },
      {
        "Ref": 63,
        "Total hedgerow units": "",
        "rowNum": 72
      },
      {
        "Ref": 64,
        "Total hedgerow units": "",
        "rowNum": 73
      },
      {
        "Ref": 65,
        "Total hedgerow units": "",
        "rowNum": 74
      },
      {
        "Ref": 66,
        "Total hedgerow units": "",
        "rowNum": 75
      },
      {
        "Ref": 67,
        "Total hedgerow units": "",
        "rowNum": 76
      },
      {
        "Ref": 68,
        "Total hedgerow units": "",
        "rowNum": 77
      },
      {
        "Ref": 69,
        "Total hedgerow units": "",
        "rowNum": 78
      },
      {
        "Ref": 70,
        "Total hedgerow units": "",
        "rowNum": 79
      },
      {
        "Ref": 71,
        "Total hedgerow units": "",
        "rowNum": 80
      },
      {
        "Ref": 72,
        "Total hedgerow units": "",
        "rowNum": 81
      },
      {
        "Ref": 73,
        "Total hedgerow units": "",
        "rowNum": 82
      },
      {
        "Ref": 74,
        "Total hedgerow units": "",
        "rowNum": 83
      },
      {
        "Ref": 75,
        "Total hedgerow units": "",
        "rowNum": 84
      },
      {
        "Ref": 76,
        "Total hedgerow units": "",
        "rowNum": 85
      },
      {
        "Ref": 77,
        "Total hedgerow units": "",
        "rowNum": 86
      },
      {
        "Ref": 78,
        "Total hedgerow units": "",
        "rowNum": 87
      },
      {
        "Ref": 79,
        "Total hedgerow units": "",
        "rowNum": 88
      },
      {
        "Ref": 80,
        "Total hedgerow units": "",
        "rowNum": 89
      },
      {
        "Ref": 81,
        "Total hedgerow units": "",
        "rowNum": 90
      },
      {
        "Ref": 82,
        "Total hedgerow units": "",
        "rowNum": 91
      },
      {
        "Ref": 83,
        "Total hedgerow units": "",
        "rowNum": 92
      },
      {
        "Ref": 84,
        "Total hedgerow units": "",
        "rowNum": 93
      },
      {
        "Ref": 85,
        "Total hedgerow units": "",
        "rowNum": 94
      },
      {
        "Ref": 86,
        "Total hedgerow units": "",
        "rowNum": 95
      },
      {
        "Ref": 87,
        "Total hedgerow units": "",
        "rowNum": 96
      },
      {
        "Ref": 88,
        "Total hedgerow units": "",
        "rowNum": 97
      },
      {
        "Ref": 89,
        "Total hedgerow units": "",
        "rowNum": 98
      },
      {
        "Ref": 90,
        "Total hedgerow units": "",
        "rowNum": 99
      },
      {
        "Ref": 91,
        "Total hedgerow units": "",
        "rowNum": 100
      },
      {
        "Ref": 92,
        "Total hedgerow units": "",
        "rowNum": 101
      },
      {
        "Ref": 93,
        "Total hedgerow units": "",
        "rowNum": 102
      },
      {
        "Ref": 94,
        "Total hedgerow units": "",
        "rowNum": 103
      },
      {
        "Ref": 95,
        "Total hedgerow units": "",
        "rowNum": 104
      },
      {
        "Ref": 96,
        "Total hedgerow units": "",
        "rowNum": 105
      },
      {
        "Ref": 97,
        "Total hedgerow units": "",
        "rowNum": 106
      },
      {
        "Ref": 98,
        "Total hedgerow units": "",
        "rowNum": 107
      },
      {
        "Ref": 99,
        "Total hedgerow units": "",
        "rowNum": 108
      },
      {
        "Ref": 100,
        "Total hedgerow units": "",
        "rowNum": 109
      },
      {
        "Ref": 101,
        "Total hedgerow units": "",
        "rowNum": 110
      },
      {
        "Ref": 102,
        "Total hedgerow units": "",
        "rowNum": 111
      },
      {
        "Ref": 103,
        "Total hedgerow units": "",
        "rowNum": 112
      },
      {
        "Ref": 104,
        "Total hedgerow units": "",
        "rowNum": 113
      },
      {
        "Ref": 105,
        "Total hedgerow units": "",
        "rowNum": 114
      },
      {
        "Ref": 106,
        "Total hedgerow units": "",
        "rowNum": 115
      },
      {
        "Ref": 107,
        "Total hedgerow units": "",
        "rowNum": 116
      },
      {
        "Ref": 108,
        "Total hedgerow units": "",
        "rowNum": 117
      },
      {
        "Ref": 109,
        "Total hedgerow units": "",
        "rowNum": 118
      },
      {
        "Ref": 110,
        "Total hedgerow units": "",
        "rowNum": 119
      },
      {
        "Ref": 111,
        "Total hedgerow units": "",
        "rowNum": 120
      },
      {
        "Ref": 112,
        "Total hedgerow units": "",
        "rowNum": 121
      },
      {
        "Ref": 113,
        "Total hedgerow units": "",
        "rowNum": 122
      },
      {
        "Ref": 114,
        "Total hedgerow units": "",
        "rowNum": 123
      },
      {
        "Ref": 115,
        "Total hedgerow units": "",
        "rowNum": 124
      },
      {
        "Ref": 116,
        "Total hedgerow units": "",
        "rowNum": 125
      },
      {
        "Ref": 117,
        "Total hedgerow units": "",
        "rowNum": 126
      },
      {
        "Ref": 118,
        "Total hedgerow units": "",
        "rowNum": 127
      },
      {
        "Ref": 119,
        "Total hedgerow units": "",
        "rowNum": 128
      },
      {
        "Ref": 120,
        "Total hedgerow units": "",
        "rowNum": 129
      },
      {
        "Ref": 121,
        "Total hedgerow units": "",
        "rowNum": 130
      },
      {
        "Ref": 122,
        "Total hedgerow units": "",
        "rowNum": 131
      },
      {
        "Ref": 123,
        "Total hedgerow units": "",
        "rowNum": 132
      },
      {
        "Ref": 124,
        "Total hedgerow units": "",
        "rowNum": 133
      },
      {
        "Ref": 125,
        "Total hedgerow units": "",
        "rowNum": 134
      },
      {
        "Ref": 126,
        "Total hedgerow units": "",
        "rowNum": 135
      },
      {
        "Ref": 127,
        "Total hedgerow units": "",
        "rowNum": 136
      },
      {
        "Ref": 128,
        "Total hedgerow units": "",
        "rowNum": 137
      },
      {
        "Ref": 129,
        "Total hedgerow units": "",
        "rowNum": 138
      },
      {
        "Ref": 130,
        "Total hedgerow units": "",
        "rowNum": 139
      },
      {
        "Ref": 131,
        "Total hedgerow units": "",
        "rowNum": 140
      },
      {
        "Ref": 132,
        "Total hedgerow units": "",
        "rowNum": 141
      },
      {
        "Ref": 133,
        "Total hedgerow units": "",
        "rowNum": 142
      },
      {
        "Ref": 134,
        "Total hedgerow units": "",
        "rowNum": 143
      },
      {
        "Ref": 135,
        "Total hedgerow units": "",
        "rowNum": 144
      },
      {
        "Ref": 136,
        "Total hedgerow units": "",
        "rowNum": 145
      },
      {
        "Ref": 137,
        "Total hedgerow units": "",
        "rowNum": 146
      },
      {
        "Ref": 138,
        "Total hedgerow units": "",
        "rowNum": 147
      },
      {
        "Ref": 139,
        "Total hedgerow units": "",
        "rowNum": 148
      },
      {
        "Ref": 140,
        "Total hedgerow units": "",
        "rowNum": 149
      },
      {
        "Ref": 141,
        "Total hedgerow units": "",
        "rowNum": 150
      },
      {
        "Ref": 142,
        "Total hedgerow units": "",
        "rowNum": 151
      },
      {
        "Ref": 143,
        "Total hedgerow units": "",
        "rowNum": 152
      },
      {
        "Ref": 144,
        "Total hedgerow units": "",
        "rowNum": 153
      },
      {
        "Ref": 145,
        "Total hedgerow units": "",
        "rowNum": 154
      },
      {
        "Ref": 146,
        "Total hedgerow units": "",
        "rowNum": 155
      },
      {
        "Ref": 147,
        "Total hedgerow units": "",
        "rowNum": 156
      },
      {
        "Ref": 148,
        "Total hedgerow units": "",
        "rowNum": 157
      },
      {
        "Ref": 149,
        "Total hedgerow units": "",
        "rowNum": 158
      },
      {
        "Ref": 150,
        "Total hedgerow units": "",
        "rowNum": 159
      },
      {
        "Ref": 151,
        "Total hedgerow units": "",
        "rowNum": 160
      },
      {
        "Ref": 152,
        "Total hedgerow units": "",
        "rowNum": 161
      },
      {
        "Ref": 153,
        "Total hedgerow units": "",
        "rowNum": 162
      },
      {
        "Ref": 154,
        "Total hedgerow units": "",
        "rowNum": 163
      },
      {
        "Ref": 155,
        "Total hedgerow units": "",
        "rowNum": 164
      },
      {
        "Ref": 156,
        "Total hedgerow units": "",
        "rowNum": 165
      },
      {
        "Ref": 157,
        "Total hedgerow units": "",
        "rowNum": 166
      },
      {
        "Ref": 158,
        "Total hedgerow units": "",
        "rowNum": 167
      },
      {
        "Ref": 159,
        "Total hedgerow units": "",
        "rowNum": 168
      },
      {
        "Ref": 160,
        "Total hedgerow units": "",
        "rowNum": 169
      },
      {
        "Ref": 161,
        "Total hedgerow units": "",
        "rowNum": 170
      },
      {
        "Ref": 162,
        "Total hedgerow units": "",
        "rowNum": 171
      },
      {
        "Ref": 163,
        "Total hedgerow units": "",
        "rowNum": 172
      },
      {
        "Ref": 164,
        "Total hedgerow units": "",
        "rowNum": 173
      },
      {
        "Ref": 165,
        "Total hedgerow units": "",
        "rowNum": 174
      },
      {
        "Ref": 166,
        "Total hedgerow units": "",
        "rowNum": 175
      },
      {
        "Ref": 167,
        "Total hedgerow units": "",
        "rowNum": 176
      },
      {
        "Ref": 168,
        "Total hedgerow units": "",
        "rowNum": 177
      },
      {
        "Ref": 169,
        "Total hedgerow units": "",
        "rowNum": 178
      },
      {
        "Ref": 170,
        "Total hedgerow units": "",
        "rowNum": 179
      },
      {
        "Ref": 171,
        "Total hedgerow units": "",
        "rowNum": 180
      },
      {
        "Ref": 172,
        "Total hedgerow units": "",
        "rowNum": 181
      },
      {
        "Ref": 173,
        "Total hedgerow units": "",
        "rowNum": 182
      },
      {
        "Ref": 174,
        "Total hedgerow units": "",
        "rowNum": 183
      },
      {
        "Ref": 175,
        "Total hedgerow units": "",
        "rowNum": 184
      },
      {
        "Ref": 176,
        "Total hedgerow units": "",
        "rowNum": 185
      },
      {
        "Ref": 177,
        "Total hedgerow units": "",
        "rowNum": 186
      },
      {
        "Ref": 178,
        "Total hedgerow units": "",
        "rowNum": 187
      },
      {
        "Ref": 179,
        "Total hedgerow units": "",
        "rowNum": 188
      },
      {
        "Ref": 180,
        "Total hedgerow units": "",
        "rowNum": 189
      },
      {
        "Ref": 181,
        "Total hedgerow units": "",
        "rowNum": 190
      },
      {
        "Ref": 182,
        "Total hedgerow units": "",
        "rowNum": 191
      },
      {
        "Ref": 183,
        "Total hedgerow units": "",
        "rowNum": 192
      },
      {
        "Ref": 184,
        "Total hedgerow units": "",
        "rowNum": 193
      },
      {
        "Ref": 185,
        "Total hedgerow units": "",
        "rowNum": 194
      },
      {
        "Ref": 186,
        "Total hedgerow units": "",
        "rowNum": 195
      },
      {
        "Ref": 187,
        "Total hedgerow units": "",
        "rowNum": 196
      },
      {
        "Ref": 188,
        "Total hedgerow units": "",
        "rowNum": 197
      },
      {
        "Ref": 189,
        "Total hedgerow units": "",
        "rowNum": 198
      },
      {
        "Ref": 190,
        "Total hedgerow units": "",
        "rowNum": 199
      },
      {
        "Ref": 191,
        "Total hedgerow units": "",
        "rowNum": 200
      },
      {
        "Ref": 192,
        "Total hedgerow units": "",
        "rowNum": 201
      },
      {
        "Ref": 193,
        "Total hedgerow units": "",
        "rowNum": 202
      },
      {
        "Ref": 194,
        "Total hedgerow units": "",
        "rowNum": 203
      },
      {
        "Ref": 195,
        "Total hedgerow units": "",
        "rowNum": 204
      },
      {
        "Ref": 196,
        "Total hedgerow units": "",
        "rowNum": 205
      },
      {
        "Ref": 197,
        "Total hedgerow units": "",
        "rowNum": 206
      },
      {
        "Ref": 198,
        "Total hedgerow units": "",
        "rowNum": 207
      },
      {
        "Ref": 199,
        "Total hedgerow units": "",
        "rowNum": 208
      },
      {
        "Ref": 200,
        "Total hedgerow units": "",
        "rowNum": 209
      },
      {
        "Ref": 201,
        "Total hedgerow units": "",
        "rowNum": 210
      },
      {
        "Ref": 202,
        "Total hedgerow units": "",
        "rowNum": 211
      },
      {
        "Ref": 203,
        "Total hedgerow units": "",
        "rowNum": 212
      },
      {
        "Ref": 204,
        "Total hedgerow units": "",
        "rowNum": 213
      },
      {
        "Ref": 205,
        "Total hedgerow units": "",
        "rowNum": 214
      },
      {
        "Ref": 206,
        "Total hedgerow units": "",
        "rowNum": 215
      },
      {
        "Ref": 207,
        "Total hedgerow units": "",
        "rowNum": 216
      },
      {
        "Ref": 208,
        "Total hedgerow units": "",
        "rowNum": 217
      },
      {
        "Ref": 209,
        "Total hedgerow units": "",
        "rowNum": 218
      },
      {
        "Ref": 210,
        "Total hedgerow units": "",
        "rowNum": 219
      },
      {
        "Ref": 211,
        "Total hedgerow units": "",
        "rowNum": 220
      },
      {
        "Ref": 212,
        "Total hedgerow units": "",
        "rowNum": 221
      },
      {
        "Ref": 213,
        "Total hedgerow units": "",
        "rowNum": 222
      },
      {
        "Ref": 214,
        "Total hedgerow units": "",
        "rowNum": 223
      },
      {
        "Ref": 215,
        "Total hedgerow units": "",
        "rowNum": 224
      },
      {
        "Ref": 216,
        "Total hedgerow units": "",
        "rowNum": 225
      },
      {
        "Ref": 217,
        "Total hedgerow units": "",
        "rowNum": 226
      },
      {
        "Ref": 218,
        "Total hedgerow units": "",
        "rowNum": 227
      },
      {
        "Ref": 219,
        "Total hedgerow units": "",
        "rowNum": 228
      },
      {
        "Ref": 220,
        "Total hedgerow units": "",
        "rowNum": 229
      },
      {
        "Ref": 221,
        "Total hedgerow units": "",
        "rowNum": 230
      },
      {
        "Ref": 222,
        "Total hedgerow units": "",
        "rowNum": 231
      },
      {
        "Ref": 223,
        "Total hedgerow units": "",
        "rowNum": 232
      },
      {
        "Ref": 224,
        "Total hedgerow units": "",
        "rowNum": 233
      },
      {
        "Ref": 225,
        "Total hedgerow units": "",
        "rowNum": 234
      },
      {
        "Ref": 226,
        "Total hedgerow units": "",
        "rowNum": 235
      },
      {
        "Ref": 227,
        "Total hedgerow units": "",
        "rowNum": 236
      },
      {
        "Ref": 228,
        "Total hedgerow units": "",
        "rowNum": 237
      },
      {
        "Ref": 229,
        "Total hedgerow units": "",
        "rowNum": 238
      },
      {
        "Ref": 230,
        "Total hedgerow units": "",
        "rowNum": 239
      },
      {
        "Ref": 231,
        "Total hedgerow units": "",
        "rowNum": 240
      },
      {
        "Ref": 232,
        "Total hedgerow units": "",
        "rowNum": 241
      },
      {
        "Ref": 233,
        "Total hedgerow units": "",
        "rowNum": 242
      },
      {
        "Ref": 234,
        "Total hedgerow units": "",
        "rowNum": 243
      },
      {
        "Ref": 235,
        "Total hedgerow units": "",
        "rowNum": 244
      },
      {
        "Ref": 236,
        "Total hedgerow units": "",
        "rowNum": 245
      },
      {
        "Ref": 237,
        "Total hedgerow units": "",
        "rowNum": 246
      },
      {
        "Ref": 238,
        "Total hedgerow units": "",
        "rowNum": 247
      },
      {
        "Ref": 239,
        "Total hedgerow units": "",
        "rowNum": 248
      },
      {
        "Ref": 240,
        "Total hedgerow units": "",
        "rowNum": 249
      },
      {
        "Ref": 241,
        "Total hedgerow units": "",
        "rowNum": 250
      },
      {
        "Ref": 242,
        "Total hedgerow units": "",
        "rowNum": 251
      },
      {
        "Ref": 243,
        "Total hedgerow units": "",
        "rowNum": 252
      },
      {
        "Ref": 244,
        "Total hedgerow units": "",
        "rowNum": 253
      },
      {
        "Ref": 245,
        "Total hedgerow units": "",
        "rowNum": 254
      },
      {
        "Ref": 246,
        "Total hedgerow units": "",
        "rowNum": 255
      },
      {
        "Ref": 247,
        "Total hedgerow units": "",
        "rowNum": 256
      },
      {
        "Ref": 248,
        "Total hedgerow units": "",
        "rowNum": 257
      },
      {
        "Length (km)": 0.933,
        "Total hedgerow units": 4.2918,
        "Length enhanced": 0.933,
        "rowNum": 258
      }
    ],
    "e2": [
      {
        "Length (km)": 0,
        "rowNum": 260,
        "Hedge units delivered": 0
      }
    ],
    "e3": [
      {
        "Baseline ref": 1,
        "Baseline habitat": "Native hedgerow",
        "Length (km)": 0.933,
        "Distinctiveness": "Low",
        "Strategic significance": "Formally identified in local strategy",
        "Habitat enhanced in advance (years)": 0,
        "Delay in starting habitat enhancement (years)": 0,
        "Off-site reference": 1,
        "rowNum": 12,
        "Proposed habitat": "Native hedgerow",
        "Hedge units delivered": 6.2901157275,
        "Condition": "Good",
        "Habitat reference Number": "HAB-00001095-BK5J8"
      },
      {
        "rowNum": 258,
        "Length (km)": 0.933,
        "Hedge units delivered": 6.2901157275
      }
    ],
    "f1": [
      {
        "Ref": 1,
        "Total watercourse units": " ",
        "rowNum": 10
      },
      {
        "Ref": 2,
        "Total watercourse units": " ",
        "rowNum": 11
      },
      {
        "Ref": 3,
        "Total watercourse units": " ",
        "rowNum": 12
      },
      {
        "Ref": 4,
        "Total watercourse units": " ",
        "rowNum": 13
      },
      {
        "Ref": 5,
        "Total watercourse units": " ",
        "rowNum": 14
      },
      {
        "Ref": 6,
        "Total watercourse units": " ",
        "rowNum": 15
      },
      {
        "Ref": 7,
        "Total watercourse units": " ",
        "rowNum": 16
      },
      {
        "Ref": 8,
        "Total watercourse units": " ",
        "rowNum": 17
      },
      {
        "Ref": 9,
        "Total watercourse units": " ",
        "rowNum": 18
      },
      {
        "Ref": 10,
        "Total watercourse units": " ",
        "rowNum": 19
      },
      {
        "Ref": 11,
        "Total watercourse units": " ",
        "rowNum": 20
      },
      {
        "Ref": 12,
        "Total watercourse units": " ",
        "rowNum": 21
      },
      {
        "Ref": 13,
        "Total watercourse units": " ",
        "rowNum": 22
      },
      {
        "Ref": 14,
        "Total watercourse units": " ",
        "rowNum": 23
      },
      {
        "Ref": 15,
        "Total watercourse units": " ",
        "rowNum": 24
      },
      {
        "Ref": 16,
        "Total watercourse units": " ",
        "rowNum": 25
      },
      {
        "Ref": 17,
        "Total watercourse units": " ",
        "rowNum": 26
      },
      {
        "Ref": 18,
        "Total watercourse units": " ",
        "rowNum": 27
      },
      {
        "Ref": 19,
        "Total watercourse units": " ",
        "rowNum": 28
      },
      {
        "Ref": 20,
        "Total watercourse units": " ",
        "rowNum": 29
      },
      {
        "Ref": 21,
        "Total watercourse units": " ",
        "rowNum": 30
      },
      {
        "Ref": 22,
        "Total watercourse units": " ",
        "rowNum": 31
      },
      {
        "Ref": 23,
        "Total watercourse units": " ",
        "rowNum": 32
      },
      {
        "Ref": 24,
        "Total watercourse units": " ",
        "rowNum": 33
      },
      {
        "Ref": 25,
        "Total watercourse units": " ",
        "rowNum": 34
      },
      {
        "Ref": 26,
        "Total watercourse units": " ",
        "rowNum": 35
      },
      {
        "Ref": 27,
        "Total watercourse units": " ",
        "rowNum": 36
      },
      {
        "Ref": 28,
        "Total watercourse units": " ",
        "rowNum": 37
      },
      {
        "Ref": 29,
        "Total watercourse units": " ",
        "rowNum": 38
      },
      {
        "Ref": 30,
        "Total watercourse units": " ",
        "rowNum": 39
      },
      {
        "Ref": 31,
        "Total watercourse units": " ",
        "rowNum": 40
      },
      {
        "Ref": 32,
        "Total watercourse units": " ",
        "rowNum": 41
      },
      {
        "Ref": 33,
        "Total watercourse units": " ",
        "rowNum": 42
      },
      {
        "Ref": 34,
        "Total watercourse units": " ",
        "rowNum": 43
      },
      {
        "Ref": 35,
        "Total watercourse units": " ",
        "rowNum": 44
      },
      {
        "Ref": 36,
        "Total watercourse units": " ",
        "rowNum": 45
      },
      {
        "Ref": 37,
        "Total watercourse units": " ",
        "rowNum": 46
      },
      {
        "Ref": 38,
        "Total watercourse units": " ",
        "rowNum": 47
      },
      {
        "Ref": 39,
        "Total watercourse units": " ",
        "rowNum": 48
      },
      {
        "Ref": 40,
        "Total watercourse units": " ",
        "rowNum": 49
      },
      {
        "Ref": 41,
        "Total watercourse units": " ",
        "rowNum": 50
      },
      {
        "Ref": 42,
        "Total watercourse units": " ",
        "rowNum": 51
      },
      {
        "Ref": 43,
        "Total watercourse units": " ",
        "rowNum": 52
      },
      {
        "Ref": 44,
        "Total watercourse units": " ",
        "rowNum": 53
      },
      {
        "Ref": 45,
        "Total watercourse units": " ",
        "rowNum": 54
      },
      {
        "Ref": 46,
        "Total watercourse units": " ",
        "rowNum": 55
      },
      {
        "Ref": 47,
        "Total watercourse units": " ",
        "rowNum": 56
      },
      {
        "Ref": 48,
        "Total watercourse units": " ",
        "rowNum": 57
      },
      {
        "Ref": 49,
        "Total watercourse units": " ",
        "rowNum": 58
      },
      {
        "Ref": 50,
        "Total watercourse units": " ",
        "rowNum": 59
      },
      {
        "Ref": 51,
        "Total watercourse units": " ",
        "rowNum": 60
      },
      {
        "Ref": 52,
        "Total watercourse units": " ",
        "rowNum": 61
      },
      {
        "Ref": 53,
        "Total watercourse units": " ",
        "rowNum": 62
      },
      {
        "Ref": 54,
        "Total watercourse units": " ",
        "rowNum": 63
      },
      {
        "Ref": 55,
        "Total watercourse units": " ",
        "rowNum": 64
      },
      {
        "Ref": 56,
        "Total watercourse units": " ",
        "rowNum": 65
      },
      {
        "Ref": 57,
        "Total watercourse units": " ",
        "rowNum": 66
      },
      {
        "Ref": 58,
        "Total watercourse units": " ",
        "rowNum": 67
      },
      {
        "Ref": 59,
        "Total watercourse units": " ",
        "rowNum": 68
      },
      {
        "Ref": 60,
        "Total watercourse units": " ",
        "rowNum": 69
      },
      {
        "Ref": 61,
        "Total watercourse units": " ",
        "rowNum": 70
      },
      {
        "Ref": 62,
        "Total watercourse units": " ",
        "rowNum": 71
      },
      {
        "Ref": 63,
        "Total watercourse units": " ",
        "rowNum": 72
      },
      {
        "Ref": 64,
        "Total watercourse units": " ",
        "rowNum": 73
      },
      {
        "Ref": 65,
        "Total watercourse units": " ",
        "rowNum": 74
      },
      {
        "Ref": 66,
        "Total watercourse units": " ",
        "rowNum": 75
      },
      {
        "Ref": 67,
        "Total watercourse units": " ",
        "rowNum": 76
      },
      {
        "Ref": 68,
        "Total watercourse units": " ",
        "rowNum": 77
      },
      {
        "Ref": 69,
        "Total watercourse units": " ",
        "rowNum": 78
      },
      {
        "Ref": 70,
        "Total watercourse units": " ",
        "rowNum": 79
      },
      {
        "Ref": 71,
        "Total watercourse units": " ",
        "rowNum": 80
      },
      {
        "Ref": 72,
        "Total watercourse units": " ",
        "rowNum": 81
      },
      {
        "Ref": 73,
        "Total watercourse units": " ",
        "rowNum": 82
      },
      {
        "Ref": 74,
        "Total watercourse units": " ",
        "rowNum": 83
      },
      {
        "Ref": 75,
        "Total watercourse units": " ",
        "rowNum": 84
      },
      {
        "Ref": 76,
        "Total watercourse units": " ",
        "rowNum": 85
      },
      {
        "Ref": 77,
        "Total watercourse units": " ",
        "rowNum": 86
      },
      {
        "Ref": 78,
        "Total watercourse units": " ",
        "rowNum": 87
      },
      {
        "Ref": 79,
        "Total watercourse units": " ",
        "rowNum": 88
      },
      {
        "Ref": 80,
        "Total watercourse units": " ",
        "rowNum": 89
      },
      {
        "Ref": 81,
        "Total watercourse units": " ",
        "rowNum": 90
      },
      {
        "Ref": 82,
        "Total watercourse units": " ",
        "rowNum": 91
      },
      {
        "Ref": 83,
        "Total watercourse units": " ",
        "rowNum": 92
      },
      {
        "Ref": 84,
        "Total watercourse units": " ",
        "rowNum": 93
      },
      {
        "Ref": 85,
        "Total watercourse units": " ",
        "rowNum": 94
      },
      {
        "Ref": 86,
        "Total watercourse units": " ",
        "rowNum": 95
      },
      {
        "Ref": 87,
        "Total watercourse units": " ",
        "rowNum": 96
      },
      {
        "Ref": 88,
        "Total watercourse units": " ",
        "rowNum": 97
      },
      {
        "Ref": 89,
        "Total watercourse units": " ",
        "rowNum": 98
      },
      {
        "Ref": 90,
        "Total watercourse units": " ",
        "rowNum": 99
      },
      {
        "Ref": 91,
        "Total watercourse units": " ",
        "rowNum": 100
      },
      {
        "Ref": 92,
        "Total watercourse units": " ",
        "rowNum": 101
      },
      {
        "Ref": 93,
        "Total watercourse units": " ",
        "rowNum": 102
      },
      {
        "Ref": 94,
        "Total watercourse units": " ",
        "rowNum": 103
      },
      {
        "Ref": 95,
        "Total watercourse units": " ",
        "rowNum": 104
      },
      {
        "Ref": 96,
        "Total watercourse units": " ",
        "rowNum": 105
      },
      {
        "Ref": 97,
        "Total watercourse units": " ",
        "rowNum": 106
      },
      {
        "Ref": 98,
        "Total watercourse units": " ",
        "rowNum": 107
      },
      {
        "Ref": 99,
        "Total watercourse units": " ",
        "rowNum": 108
      },
      {
        "Ref": 100,
        "Total watercourse units": " ",
        "rowNum": 109
      },
      {
        "Ref": 101,
        "Total watercourse units": " ",
        "rowNum": 110
      },
      {
        "Ref": 102,
        "Total watercourse units": " ",
        "rowNum": 111
      },
      {
        "Ref": 103,
        "Total watercourse units": " ",
        "rowNum": 112
      },
      {
        "Ref": 104,
        "Total watercourse units": " ",
        "rowNum": 113
      },
      {
        "Ref": 105,
        "Total watercourse units": " ",
        "rowNum": 114
      },
      {
        "Ref": 106,
        "Total watercourse units": " ",
        "rowNum": 115
      },
      {
        "Ref": 107,
        "Total watercourse units": " ",
        "rowNum": 116
      },
      {
        "Ref": 108,
        "Total watercourse units": " ",
        "rowNum": 117
      },
      {
        "Ref": 109,
        "Total watercourse units": " ",
        "rowNum": 118
      },
      {
        "Ref": 110,
        "Total watercourse units": " ",
        "rowNum": 119
      },
      {
        "Ref": 111,
        "Total watercourse units": " ",
        "rowNum": 120
      },
      {
        "Ref": 112,
        "Total watercourse units": " ",
        "rowNum": 121
      },
      {
        "Ref": 113,
        "Total watercourse units": " ",
        "rowNum": 122
      },
      {
        "Ref": 114,
        "Total watercourse units": " ",
        "rowNum": 123
      },
      {
        "Ref": 115,
        "Total watercourse units": " ",
        "rowNum": 124
      },
      {
        "Ref": 116,
        "Total watercourse units": " ",
        "rowNum": 125
      },
      {
        "Ref": 117,
        "Total watercourse units": " ",
        "rowNum": 126
      },
      {
        "Ref": 118,
        "Total watercourse units": " ",
        "rowNum": 127
      },
      {
        "Ref": 119,
        "Total watercourse units": " ",
        "rowNum": 128
      },
      {
        "Ref": 120,
        "Total watercourse units": " ",
        "rowNum": 129
      },
      {
        "Ref": 121,
        "Total watercourse units": " ",
        "rowNum": 130
      },
      {
        "Ref": 122,
        "Total watercourse units": " ",
        "rowNum": 131
      },
      {
        "Ref": 123,
        "Total watercourse units": " ",
        "rowNum": 132
      },
      {
        "Ref": 124,
        "Total watercourse units": " ",
        "rowNum": 133
      },
      {
        "Ref": 125,
        "Total watercourse units": " ",
        "rowNum": 134
      },
      {
        "Ref": 126,
        "Total watercourse units": " ",
        "rowNum": 135
      },
      {
        "Ref": 127,
        "Total watercourse units": " ",
        "rowNum": 136
      },
      {
        "Ref": 128,
        "Total watercourse units": " ",
        "rowNum": 137
      },
      {
        "Ref": 129,
        "Total watercourse units": " ",
        "rowNum": 138
      },
      {
        "Ref": 130,
        "Total watercourse units": " ",
        "rowNum": 139
      },
      {
        "Ref": 131,
        "Total watercourse units": " ",
        "rowNum": 140
      },
      {
        "Ref": 132,
        "Total watercourse units": " ",
        "rowNum": 141
      },
      {
        "Ref": 133,
        "Total watercourse units": " ",
        "rowNum": 142
      },
      {
        "Ref": 134,
        "Total watercourse units": " ",
        "rowNum": 143
      },
      {
        "Ref": 135,
        "Total watercourse units": " ",
        "rowNum": 144
      },
      {
        "Ref": 136,
        "Total watercourse units": " ",
        "rowNum": 145
      },
      {
        "Ref": 137,
        "Total watercourse units": " ",
        "rowNum": 146
      },
      {
        "Ref": 138,
        "Total watercourse units": " ",
        "rowNum": 147
      },
      {
        "Ref": 139,
        "Total watercourse units": " ",
        "rowNum": 148
      },
      {
        "Ref": 140,
        "Total watercourse units": " ",
        "rowNum": 149
      },
      {
        "Ref": 141,
        "Total watercourse units": " ",
        "rowNum": 150
      },
      {
        "Ref": 142,
        "Total watercourse units": " ",
        "rowNum": 151
      },
      {
        "Ref": 143,
        "Total watercourse units": " ",
        "rowNum": 152
      },
      {
        "Ref": 144,
        "Total watercourse units": " ",
        "rowNum": 153
      },
      {
        "Ref": 145,
        "Total watercourse units": " ",
        "rowNum": 154
      },
      {
        "Ref": 146,
        "Total watercourse units": " ",
        "rowNum": 155
      },
      {
        "Ref": 147,
        "Total watercourse units": " ",
        "rowNum": 156
      },
      {
        "Ref": 148,
        "Total watercourse units": " ",
        "rowNum": 157
      },
      {
        "Ref": 149,
        "Total watercourse units": " ",
        "rowNum": 158
      },
      {
        "Ref": 150,
        "Total watercourse units": " ",
        "rowNum": 159
      },
      {
        "Ref": 151,
        "Total watercourse units": " ",
        "rowNum": 160
      },
      {
        "Ref": 152,
        "Total watercourse units": " ",
        "rowNum": 161
      },
      {
        "Ref": 153,
        "Total watercourse units": " ",
        "rowNum": 162
      },
      {
        "Ref": 154,
        "Total watercourse units": " ",
        "rowNum": 163
      },
      {
        "Ref": 155,
        "Total watercourse units": " ",
        "rowNum": 164
      },
      {
        "Ref": 156,
        "Total watercourse units": " ",
        "rowNum": 165
      },
      {
        "Ref": 157,
        "Total watercourse units": " ",
        "rowNum": 166
      },
      {
        "Ref": 158,
        "Total watercourse units": " ",
        "rowNum": 167
      },
      {
        "Ref": 159,
        "Total watercourse units": " ",
        "rowNum": 168
      },
      {
        "Ref": 160,
        "Total watercourse units": " ",
        "rowNum": 169
      },
      {
        "Ref": 161,
        "Total watercourse units": " ",
        "rowNum": 170
      },
      {
        "Ref": 162,
        "Total watercourse units": " ",
        "rowNum": 171
      },
      {
        "Ref": 163,
        "Total watercourse units": " ",
        "rowNum": 172
      },
      {
        "Ref": 164,
        "Total watercourse units": " ",
        "rowNum": 173
      },
      {
        "Ref": 165,
        "Total watercourse units": " ",
        "rowNum": 174
      },
      {
        "Ref": 166,
        "Total watercourse units": " ",
        "rowNum": 175
      },
      {
        "Ref": 167,
        "Total watercourse units": " ",
        "rowNum": 176
      },
      {
        "Ref": 168,
        "Total watercourse units": " ",
        "rowNum": 177
      },
      {
        "Ref": 169,
        "Total watercourse units": " ",
        "rowNum": 178
      },
      {
        "Ref": 170,
        "Total watercourse units": " ",
        "rowNum": 179
      },
      {
        "Ref": 171,
        "Total watercourse units": " ",
        "rowNum": 180
      },
      {
        "Ref": 172,
        "Total watercourse units": " ",
        "rowNum": 181
      },
      {
        "Ref": 173,
        "Total watercourse units": " ",
        "rowNum": 182
      },
      {
        "Ref": 174,
        "Total watercourse units": " ",
        "rowNum": 183
      },
      {
        "Ref": 175,
        "Total watercourse units": " ",
        "rowNum": 184
      },
      {
        "Ref": 176,
        "Total watercourse units": " ",
        "rowNum": 185
      },
      {
        "Ref": 177,
        "Total watercourse units": " ",
        "rowNum": 186
      },
      {
        "Ref": 178,
        "Total watercourse units": " ",
        "rowNum": 187
      },
      {
        "Ref": 179,
        "Total watercourse units": " ",
        "rowNum": 188
      },
      {
        "Ref": 180,
        "Total watercourse units": " ",
        "rowNum": 189
      },
      {
        "Ref": 181,
        "Total watercourse units": " ",
        "rowNum": 190
      },
      {
        "Ref": 182,
        "Total watercourse units": " ",
        "rowNum": 191
      },
      {
        "Ref": 183,
        "Total watercourse units": " ",
        "rowNum": 192
      },
      {
        "Ref": 184,
        "Total watercourse units": " ",
        "rowNum": 193
      },
      {
        "Ref": 185,
        "Total watercourse units": " ",
        "rowNum": 194
      },
      {
        "Ref": 186,
        "Total watercourse units": " ",
        "rowNum": 195
      },
      {
        "Ref": 187,
        "Total watercourse units": " ",
        "rowNum": 196
      },
      {
        "Ref": 188,
        "Total watercourse units": " ",
        "rowNum": 197
      },
      {
        "Ref": 189,
        "Total watercourse units": " ",
        "rowNum": 198
      },
      {
        "Ref": 190,
        "Total watercourse units": " ",
        "rowNum": 199
      },
      {
        "Ref": 191,
        "Total watercourse units": " ",
        "rowNum": 200
      },
      {
        "Ref": 192,
        "Total watercourse units": " ",
        "rowNum": 201
      },
      {
        "Ref": 193,
        "Total watercourse units": " ",
        "rowNum": 202
      },
      {
        "Ref": 194,
        "Total watercourse units": " ",
        "rowNum": 203
      },
      {
        "Ref": 195,
        "Total watercourse units": " ",
        "rowNum": 204
      },
      {
        "Ref": 196,
        "Total watercourse units": " ",
        "rowNum": 205
      },
      {
        "Ref": 197,
        "Total watercourse units": " ",
        "rowNum": 206
      },
      {
        "Ref": 198,
        "Total watercourse units": " ",
        "rowNum": 207
      },
      {
        "Ref": 199,
        "Total watercourse units": " ",
        "rowNum": 208
      },
      {
        "Ref": 200,
        "Total watercourse units": " ",
        "rowNum": 209
      },
      {
        "Ref": 201,
        "Total watercourse units": " ",
        "rowNum": 210
      },
      {
        "Ref": 202,
        "Total watercourse units": " ",
        "rowNum": 211
      },
      {
        "Ref": 203,
        "Total watercourse units": " ",
        "rowNum": 212
      },
      {
        "Ref": 204,
        "Total watercourse units": " ",
        "rowNum": 213
      },
      {
        "Ref": 205,
        "Total watercourse units": " ",
        "rowNum": 214
      },
      {
        "Ref": 206,
        "Total watercourse units": " ",
        "rowNum": 215
      },
      {
        "Ref": 207,
        "Total watercourse units": " ",
        "rowNum": 216
      },
      {
        "Ref": 208,
        "Total watercourse units": " ",
        "rowNum": 217
      },
      {
        "Ref": 209,
        "Total watercourse units": " ",
        "rowNum": 218
      },
      {
        "Ref": 210,
        "Total watercourse units": " ",
        "rowNum": 219
      },
      {
        "Ref": 211,
        "Total watercourse units": " ",
        "rowNum": 220
      },
      {
        "Ref": 212,
        "Total watercourse units": " ",
        "rowNum": 221
      },
      {
        "Ref": 213,
        "Total watercourse units": " ",
        "rowNum": 222
      },
      {
        "Ref": 214,
        "Total watercourse units": " ",
        "rowNum": 223
      },
      {
        "Ref": 215,
        "Total watercourse units": " ",
        "rowNum": 224
      },
      {
        "Ref": 216,
        "Total watercourse units": " ",
        "rowNum": 225
      },
      {
        "Ref": 217,
        "Total watercourse units": " ",
        "rowNum": 226
      },
      {
        "Ref": 218,
        "Total watercourse units": " ",
        "rowNum": 227
      },
      {
        "Ref": 219,
        "Total watercourse units": " ",
        "rowNum": 228
      },
      {
        "Ref": 220,
        "Total watercourse units": " ",
        "rowNum": 229
      },
      {
        "Ref": 221,
        "Total watercourse units": " ",
        "rowNum": 230
      },
      {
        "Ref": 222,
        "Total watercourse units": " ",
        "rowNum": 231
      },
      {
        "Ref": 223,
        "Total watercourse units": " ",
        "rowNum": 232
      },
      {
        "Ref": 224,
        "Total watercourse units": " ",
        "rowNum": 233
      },
      {
        "Ref": 225,
        "Total watercourse units": " ",
        "rowNum": 234
      },
      {
        "Ref": 226,
        "Total watercourse units": " ",
        "rowNum": 235
      },
      {
        "Ref": 227,
        "Total watercourse units": " ",
        "rowNum": 236
      },
      {
        "Ref": 228,
        "Total watercourse units": " ",
        "rowNum": 237
      },
      {
        "Ref": 229,
        "Total watercourse units": " ",
        "rowNum": 238
      },
      {
        "Ref": 230,
        "Total watercourse units": " ",
        "rowNum": 239
      },
      {
        "Ref": 231,
        "Total watercourse units": " ",
        "rowNum": 240
      },
      {
        "Ref": 232,
        "Total watercourse units": " ",
        "rowNum": 241
      },
      {
        "Ref": 233,
        "Total watercourse units": " ",
        "rowNum": 242
      },
      {
        "Ref": 234,
        "Total watercourse units": " ",
        "rowNum": 243
      },
      {
        "Ref": 235,
        "Total watercourse units": " ",
        "rowNum": 244
      },
      {
        "Ref": 236,
        "Total watercourse units": " ",
        "rowNum": 245
      },
      {
        "Ref": 237,
        "Total watercourse units": " ",
        "rowNum": 246
      },
      {
        "Ref": 238,
        "Total watercourse units": " ",
        "rowNum": 247
      },
      {
        "Ref": 239,
        "Total watercourse units": " ",
        "rowNum": 248
      },
      {
        "Ref": 240,
        "Total watercourse units": " ",
        "rowNum": 249
      },
      {
        "Ref": 241,
        "Total watercourse units": " ",
        "rowNum": 250
      },
      {
        "Ref": 242,
        "Total watercourse units": " ",
        "rowNum": 251
      },
      {
        "Ref": 243,
        "Total watercourse units": " ",
        "rowNum": 252
      },
      {
        "Ref": 244,
        "Total watercourse units": " ",
        "rowNum": 253
      },
      {
        "Ref": 245,
        "Total watercourse units": " ",
        "rowNum": 254
      },
      {
        "Ref": 246,
        "Total watercourse units": " ",
        "rowNum": 255
      },
      {
        "Ref": 247,
        "Total watercourse units": " ",
        "rowNum": 256
      },
      {
        "Ref": 248,
        "Total watercourse units": " ",
        "rowNum": 257
      },
      {
        "Length (km)": 0,
        "Total watercourse units": 0,
        "Length enhanced": 0,
        "rowNum": 258
      }
    ],
    "f2": [
      {
        "Length (km)": 0,
        "rowNum": 260,
        "Watercourse units delivered": 0
      }
    ],
    "f3": [
      {
        "Length (km)": 0,
        "rowNum": 258,
        "Watercourse units delivered": 0
      }
    ],
    "habitatOffSiteGainSiteSummary": [
      {
        "Gain site reference": 1,
        "rowNum": 7,
        "Habitat Offsite unit change per gain site (Post SRM)": 221.17825783027422
      }
    ],
    "hedgeOffSiteGainSiteSummary": [
      {
        "Gain site reference": 1,
        "rowNum": 7,
        "Hedge Offsite unit change per gain site (Post SRM)": 1.9983157274999996
      }
    ],
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
  "metric-file-location": "75e2ee81-1646-42c3-9fa2-47dba5cdda40/metric-upload/CC-REG-BNGREG-CJGHR-A7VPM.xlsx"
}`

export default {
  dataString
}
