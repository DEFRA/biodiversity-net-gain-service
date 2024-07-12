const mockAllocationMetricData = {
  Result: {
    fileSize: 5063620,
    filename: 'metric-file-4.1-feb24.xlsm',
    fileType: 'application/vnd.ms-excel.sheet.macroenabled.12',
    tags: {
      'Malware Scanning scan result': 'No threats found',
      'Malware Notes': 'Mocked scan result for Azurite blob storage'
    },
    config: {
      sessionId: '77b43d7a-d1ba-41ba-8fe4-186fa82e6e6a',
      fileExt: [
        '.xlsm',
        '.xlsx'
      ],
      maxFileSize: 52428800,
      uploadType: 'developer-metric-upload',
      postProcess: true,
      blobConfig: {
        blobName: '77b43d7a-d1ba-41ba-8fe4-186fa82e6e6a/developer-metric-upload/metric-file-4.1-feb24.xlsm',
        containerName: 'customer-uploads'
      },
      fileValidationConfig: {
        fileExt: [
          '.xlsm',
          '.xlsx'
        ],
        maxFileSize: 52428800
      }
    },
    postProcess: {
      metricData: {
        startPage: {
          41: '',
          planningAuthority: 'Example',
          projectName: 'Gain Site 2 for Digital',
          applicant: 'Joe Bloggs',
          completedBy: 'Joe Bloggs',
          dateOfMetricCompletion: 45162,
          reviewer: 'Digital',
          versionControl: 'S.o.S',
          targetNetGain: 0.1,
          irreplaceableHabitatPresentAtBaseline: 'No ✓',
          totalSiteAreaIncludingIrreplaceableHabitatAreaHectares: 0,
          totalOffSiteAreaIncludingIrreplaceableHabitatAreaHectares: 4.8100000000000005,
          containsDeviationsFromTheStatutoryMetricThisMustBeAgreedWithConsentingBody: '',
          '⚠': 'Attention required',
          '▲': 'Input error/rules and principles not met',
          onSiteBaselineMapReferenceNumber: 'On-site post-intervention map reference number',
          offSiteBaselineMapReferenceNumber: 'Off-site post-intervention reference number',
          cells: {
            version: 4.1
          }
        },
        d1: [
          {
            Ref: 1,
            'Broad habitat': 'Cropland',
            'Habitat type': 'Cereal crops',
            'Area (hectares)': 1,
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Total habitat units': 2,
            'Area enhanced': 0,
            'Off-site reference': 1234,
            Condition: 'Condition Assessment N/A',
            'Habitat reference Number': 'H1'
          },
          {
            Ref: 2,
            'Broad habitat': 'Grassland',
            'Habitat type': 'Modified grassland',
            'Area (hectares)': 1.27,
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Total habitat units': 5.08,
            'Area enhanced': 0,
            Condition: 'Moderate'
          },
          {
            Ref: 3,
            'Broad habitat': 'Grassland',
            'Habitat type': 'Modified grassland',
            'Area (hectares)': 0.4,
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Total habitat units': 1.6,
            'Area enhanced': 0.4,
            Condition: 'Moderate'
          },
          {
            Ref: 4,
            'Broad habitat': 'Grassland',
            'Habitat type': 'Other neutral grassland',
            'Area (hectares)': 1.78,
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Total habitat units': 14.24,
            'Area enhanced': 0,
            Condition: 'Moderate'
          },
          {
            Ref: 5,
            'Broad habitat': 'Woodland and forest',
            'Habitat type': 'Other woodland; mixed',
            'Area (hectares)': 0.36,
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Total habitat units': 1.44,
            'Area enhanced': 0.36,
            Condition: 'Poor'
          },
          {
            'Habitat type': 'Total habitat area',
            'Area (hectares)': 4.8100000000000005,
            'Total habitat units': 24.360000000000003,
            'Area enhanced': 0.76
          }
        ],
        d2: [
          {
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Delay in starting habitat creation (years)': 0,
            'Off-site reference': 'BNGREG-0001',
            'Broad habitat': 'Grassland',
            'Proposed habitat': 'Other neutral grassland',
            'Area (hectares)': 2,
            Condition: 'Fairly Good',
            'Habitat units delivered': 15.585516133999999,
            'Habitat created in advance (years)': 0,
            'Habitat reference Number': 'H1'
          },
          {
            'Strategic significance': 'Formally identified in local strategy',
            'Delay in starting habitat creation (years)': 0,
            'Off-site reference': 'BNGREG-0002',
            'Broad habitat': 'Grassland',
            'Proposed habitat': 'Other neutral grassland',
            'Area (hectares)': 2,
            Condition: 'Moderate',
            'Habitat units delivered': 15.397648091039999,
            'Habitat created in advance (years)': 0,
            'Habitat reference Number': 'H2'
          },
          {
            'Strategic significance': 'Formally identified in local strategy',
            'Delay in starting habitat creation (years)': 0,
            'Off-site reference': 'BNGREG-0003',
            'Broad habitat': 'Heathland and shrub',
            'Proposed habitat': 'Mixed scrub',
            'Area (hectares)': 0.05,
            Condition: 'Good',
            'Habitat units delivered': 0.483194769198,
            'Habitat created in advance (years)': 0,
            'Habitat reference Number': 'H3'
          },
          {
            'Proposed habitat': 'Total habitat area',
            'Area (hectares)': 4.05,
            'Habitat units delivered': 31.466358994238
          }
        ],
        d3: [
          {
            'Baseline ref': 3,
            'Baseline habitat': 'Grassland - Modified grassland',
            'Proposed Broad Habitat': 'Grassland',
            'Condition change': 'Lower Distinctiveness Habitat - Moderate',
            'Strategic significance': 'Formally identified in local strategy',
            'Habitat enhanced in advance (years)': 0,
            'Delay in starting habitat enhancement (years)': 0,
            'Off-site reference': 1234,
            'Area (hectares)': 0.4,
            Condition: 'Moderate',
            'Habitat units delivered': 3.128519384528,
            'Proposed habitat': 'Other neutral grassland',
            'Distinctiveness change': 'Low - Medium',
            'Habitat reference Number': 'H3'
          },
          {
            'Baseline ref': 5,
            'Baseline habitat': 'Woodland and forest - Other woodland; mixed',
            'Proposed Broad Habitat': 'Woodland and forest',
            'Condition change': 'Lower Distinctiveness Habitat - Poor',
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Habitat enhanced in advance (years)': 0,
            'Delay in starting habitat enhancement (years)': 0,
            'Off-site reference': 1234,
            'Area (hectares)': 0.36,
            Condition: 'Poor',
            'Habitat units delivered': 1.60638706834992,
            'Proposed habitat': 'Lowland mixed deciduous woodland',
            'Distinctiveness change': 'Medium - High',
            'Habitat reference Number': 'H1'
          },
          {
            'Condition change': 'Total habitat area',
            'Area (hectares)': 0.76,
            'Habitat units delivered': 4.73490645287792
          }
        ],
        e1: [
          {
            Ref: 1,
            'Hedge number': 1,
            'Habitat type': 'Native hedgerow',
            'Length (km)': 0.3,
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Total hedgerow units': 0.6,
            'Length enhanced': 0.226,
            'Off-site reference': 1234,
            Condition: 'Poor',
            'Habitat reference Number': 'E1'
          },
          {
            'Length (km)': 0.3,
            'Total hedgerow units': 0.6,
            'Length enhanced': 0.226
          }
        ],
        e2: [
          {
            'Habitat type': 'Species-rich native hedgerow',
            'Length (km)': 0.074,
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Delay in starting habitat creation (years)': 0,
            'Off-site reference': 'BNGREG-0001',
            'Hedge units delivered': 0.5790828803015999,
            Condition: 'Good',
            'Habitat created in advance (years)': 0,
            'Habitat reference Number': 'H1'
          },
          {
            'Length (km)': 0.074,
            'Hedge units delivered': 0.5790828803015999
          }
        ],
        e3: [
          {
            'Baseline ref': 1,
            'Baseline habitat': 'Native hedgerow',
            'Length (km)': 0.226,
            Distinctiveness: 'Medium',
            'Strategic significance': 'Location ecologically desirable but not in local strategy',
            'Habitat enhanced in advance (years)': 0,
            'Delay in starting habitat enhancement (years)': 0,
            'Off-site reference': 1234,
            'Proposed habitat': 'Native hedgerow - associated with bank or ditch',
            'Hedge units delivered': 1.7017262107027602,
            Condition: 'Moderate',
            'Habitat reference Number': 'E3'
          },
          {
            'Length (km)': 0.226,
            'Hedge units delivered': 1.7017262107027602
          }
        ],
        f1: [
          {
            Ref: 1,
            'Watercourse type': 'Other rivers and streams',
            'Length (km)': 1,
            'Strategic significance': 'Location ecologically desirable but not in local strategy',
            'Extent of encroachment': 'No Encroachment',
            'Extent of encroachment for both banks': 'Minor/ Minor',
            'Total watercourse units': 6.2700000000000005,
            'Length enhanced': 1,
            'Off-site reference': 1234,
            Condition: 'Poor',
            'Habitat reference Number': 'F1'
          },
          {
            'Length (km)': 1,
            'Total watercourse units': 6.2700000000000005,
            'Length enhanced': 1
          }
        ],
        f2: [
          {
            'Off-site reference': 1234,
            'Watercourse units delivered': '',
            'Habitat reference Number': 'F2'
          },
          {
            'Watercourse units delivered': 0,
            'Length (km)': 0
          }
        ],
        f3: [
          {
            'Baseline ref': 1,
            'Baseline habitat': 'Other rivers and streams',
            'Length (km)': 1,
            'Strategic significance': 'Area/compensation not in local strategy/ no local strategy',
            'Habitat enhanced in advance (years)': 0,
            'Delay in starting habitat enhancement (years)': 0,
            'Extent of encroachment': 'No Encroachment',
            'Extent of encroachment for both banks': 'Minor/ Minor',
            'Off-site reference': 1234,
            'Proposed habitat': 'Other rivers and streams',
            'Watercourse units delivered': 11.443784810433002,
            Condition: 'Good',
            'Habitat reference Number': 'F3'
          },
          {
            'Length (km)': 1,
            'Watercourse units delivered': 11.443784810433002
          }
        ],
        habitatOffSiteGainSiteSummary: [
          {
            'Gain site reference': 1234,
            'Habitat Offsite unit change per gain site (Post SRM)': 2.7349064528779197
          },
          {
            'Gain site reference': 'BNGREG-0001',
            'Habitat Offsite unit change per gain site (Post SRM)': 15.585516133999999
          },
          {
            'Gain site reference': 'BNGREG-0002',
            'Habitat Offsite unit change per gain site (Post SRM)': 15.397648091039999
          },
          {
            'Gain site reference': 'BNGREG-0003',
            'Habitat Offsite unit change per gain site (Post SRM)': 0.483194769198
          }
        ],
        hedgeOffSiteGainSiteSummary: [
          {
            'Gain site reference': 1234,
            'Hedge Offsite unit change per gain site (Post SRM)': 1.1017262107027603
          },
          {
            'Hedge Offsite unit change per gain site (Post SRM)': 0.5790828803015999
          }
        ],
        waterCourseOffSiteGainSiteSummary: [
          {
            'Watercourse Offsite unit change per gain site (Post SRM)': '0'
          }
        ],
        validation: {
          isMetricWorkbook: true,
          isSupportedVersion: true,
          isOffsiteDataPresent: true,
          areOffsiteTotalsCorrect: true,
          isDraftVersion: false
        }
      }
    }
  }
}

export default mockAllocationMetricData
