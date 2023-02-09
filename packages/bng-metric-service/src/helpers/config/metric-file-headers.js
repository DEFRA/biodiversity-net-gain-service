/** ============================================================================================
 * *                   Metric file headers
 *   Most of headers will be used while defining metric file extraction config.
 *   So,this list of headers would helps to avoid redundancy and code smell.
 *===========================================================================================**/
import { logger } from 'defra-logging-facade'
import _ from 'lodash'

export const headers = {
  start: [
    'Planning authority',
    'Project name',
    'Applicant',
    'Application type',
    'Planning application reference',
    'Assessor',
    'Assessment date',
    'Reviewer',
    'Date of LPA Review',
    'Metric version',
    'Planning authority reviewer',
    'Required net gain (%)',
    'Irreplaceable habitat present on-site at baseline'
  ],
  baseline: [
    'Baseline ref',
    'Distinctiveness',
    'Condition',
    'Strategic significance',
    'Spatial risk category',
    'Units lost'
  ],
  offSiteHabitatBaseline: [
    'Broad habitat',
    'Habitat type',
    'Area (hectares)',
    'Score',
    'Strategic position multiplier',
    'Spatial risk multiplier',
    'Total habitat units',
    'Total habitat units_1',
    'Baseline units retained',
    'Baseline units enhanced',
    'Area lost'
  ],
  offSiteHedgeBaseline: [
    'Hedge number',
    'Hedgerow type',
    'Length (km)',
    'Total hedgerow units',
    'Length retained',
    'Length enhanced',
    'Units retained',
    'Units enhanced',
    'Length lost',
    'Units lost'
  ]
}
/** ================================================================================================
 ** Returns header array on the basis of given array.
 *@param headers type: The array of headers array will be combined and validated for config.
 *@return type array
 *================================================================================================**/
export const validateHeadersArray = (_headers) => {
  const combinedArray = [].concat(..._headers)
  if ((new Set(combinedArray)).size !== combinedArray.length) {
    logger.log(`${new Date().toUTCString()} Duplicate metric file field(s) exists`)
    return false
  }

  return combinedArray.map(field => _.isString(field) && field.trim())
}
/* ========================================== END OF FUNCTION ====================================== */

export default {
  startHeaders: validateHeadersArray([headers.start]),
  offSiteHabitatBaselineHeaders: validateHeadersArray([headers.baseline, headers.offSiteHabitatBaseline]),
  offSiteHedgeBaselineHeaders: validateHeadersArray([headers.baseline, headers.offSiteHedgeBaseline])
}
