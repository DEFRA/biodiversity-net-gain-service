import { formatSortCode } from '../utils/helpers.js'
import { BACS_ACCOUNT_NAME, BACS_SORT_CODE, BACS_ACCOUNT_NUMBER, BACS_SWIFT_CODE } from '../utils/config.js'

const bacs = {
  accountName: BACS_ACCOUNT_NAME,
  sortCode: BACS_SORT_CODE,
  accountNumber: BACS_ACCOUNT_NUMBER,
  swiftCode: formatSortCode(BACS_SWIFT_CODE)
}

export default bacs
