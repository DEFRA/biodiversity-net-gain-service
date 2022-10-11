import moment from 'moment'

const date = '2020-02-30'
const dateFormat = 'YYYY-MM-DD'
const toDateFormat = moment(date).format(dateFormat)
const validDate = moment(toDateFormat, dateFormat, true).isValid()
console.log('***** is it valid = ' + validDate)
