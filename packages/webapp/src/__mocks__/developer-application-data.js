export default {
  developerAllocation: {
    applicant: {
      name: 'Test User',
      emailAddress: 'test@example.com',
      role: 'Developer'
    },
    developmentDetails: {
      projectName: 'BNG-TEST',
      localAuthority: 'BNG-DEFRA',
      planningReference: 'TEST12345678'
    },
    additionalEmailAddresses: [
      {
        fullName: 'Test User',
        email: 'test1@example.com'
      }
    ],
    biodiversityGainSiteNumber: 'AZ12208461',
    confirmDevelopmentDetails: 'yes',
    confirmOffsiteGainDetails: 'yes',
    metricFileChecked: 'yes',
    metricData: {
      startPage: {
        planningAuthority: 'Dummy Authority',
        projectName: 'Dummy Project',
        applicant: 'Test User',
        planningApplicationReference: 'TEST12345678',
        planningAuthorityReviewer: 'Dummy Auth Reviewer'
      },
      d1OffSiteHabitatBaseline: [
        {
          Broadhabitat: 'Heathland and shrub',
          Habitattype: 'Gorse scrub',
          'Total habitatunits': 'Check Data ⚠',
          'Register referencenumber': 'AZ12208460'
        }
      ],
      d2OffSiteHabitatCreation: [
        {
          Proposedhabitat: 'Total habitat area',
          'Area (hectare)': 0,
          'Habitat unitsdelivered': 0
        }
      ],
      d3OffSiteHabitatEnhancement: [
        {
          'Area (hectare)': 0,
          'Habitat unitsdelivered': 0
        }
      ],
      e1OffSiteHedgeBaseline: [
        {
          Hedgerowtype: 'Species-rich native hedgerow - associated with bank or ditch',
          'Length (km)': 1,
          'Total hedgerowunits': 15.524999999999999,
          'Register referencenumber': 'AZ12208460',
          Condition: 'Good'
        }
      ],
      e2OffSiteHedgeCreation: [
        {
          'Length (km)': 0,
          'Hedge unitsdelivered': 0
        }
      ],
      e3OffSiteHedgeEnhancement: [
        {
          'Length (km)': 0,
          'Hedge unitsdelivered': 0
        }
      ],
      f1OffSiteWaterCBaseline: [
        {
          'Length (km)': 0
        }
      ],
      f2OffSiteWaterCCreation: [
        {
          'Watercourse unitsdelivered': 0,
          'Length (km)': 0
        }
      ],
      f3OffSiteWaterCEnhancement: [
        {
          'Length (km)': 0,
          'Watercourse unitsdelivered': 0
        }
      ]
    },
    referenceNumber: 'TEST-1234',
    submittedOn: '2023-06-05T09:14:15.482Z',
    files: [
      {
        contentMediaType: 'application/vnd.ms-excel.sheet.macroenabled.12',
        fileType: 'developer-upload-metric',
        fileSize: 5131037,
        fileLocation: 'mock/developer-upload-metric/Sample Metric File.xlsm',
        fileName: 'Sample Metric File.xlsm'
      },
      {
        contentMediaType: 'application/pdf',
        fileType: 'developer-upload-consent',
        fileSize: 13264,
        fileLocation: 'mock/developer-upload-consent/5May1204.pdf',
        fileName: '5May1204.pdf'
      }
    ]
  }
}
