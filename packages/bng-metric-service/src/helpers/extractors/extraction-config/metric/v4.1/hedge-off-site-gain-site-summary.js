const headers = [
  'Gain site reference',
  'Hedge Offsite unit change per gain site (Post SRM)'
]

const hedgeOffSiteGainSiteSummary = {
  sheetName: 'Off-site gain site summary',
  titleCellAddress: 'N3',
  startCell: 'N5',
  endCell: 'U107',
  cellHeaders: headers,
  columnsToBeRemoved: [],
  rowsToBeRemovedTemplate: [],
  substitutions: {
    'Off-site unit change per gain site (post-SRM)': 'Hedge Offsite unit change per gain site (Post SRM)'
  }
}

export default hedgeOffSiteGainSiteSummary
