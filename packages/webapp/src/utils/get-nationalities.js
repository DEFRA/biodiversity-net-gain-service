import allNationalities from './ref-data/nationalities.js'

const getNationalityTextAndValues = () => {
  const nationaltyTextAndValues = allNationalities.map(n => ({ text: n, value: n }))
  nationaltyTextAndValues.unshift({
    value: '',
    text: 'Choose nationality',
    selected: true
  })
  return nationaltyTextAndValues
}

export { getNationalityTextAndValues }
