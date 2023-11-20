const headers = [
  'Gain site reference',
  'Habitat Offsite unit change per gain site (Post SRM)'
]

const habitatOffSiteGainSiteSummary = {
  sheetName: 'Off-site gain site summary',
  titleCellAddress: 'B3',
  startCell: 'B5',
  endCell: 'L107',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    'Off-site unit change per gain site (post-SRM)': 'Habitat Offsite unit change per gain site (Post SRM)'
  }
}

export default habitatOffSiteGainSiteSummary
