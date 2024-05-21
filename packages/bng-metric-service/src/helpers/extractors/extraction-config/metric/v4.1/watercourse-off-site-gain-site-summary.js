const headers = [
  'Gain site reference',
  'Watercourse Offsite unit change per gain site (Post SRM)'
]

const watercourseOffSiteGainSiteSummary = {
  sheetName: 'Off-site gain site summary',
  titleCellAddress: 'W3',
  startCell: 'W5',
  endCell: 'AD107',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    'Off-site unit change per gain site (post-SRM)': 'Watercourse Offsite unit change per gain site (Post SRM)'
  }
}

export default watercourseOffSiteGainSiteSummary
