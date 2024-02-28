import { getNationalityTextAndValues } from '../get-nationalities.js'

describe('getLpaNames', () => {
  it('Should extract all nationalities from ref data and inject "Choose nationality" option', () => {
    const expectedToInclude = [
      { text: 'Latvian', value: 'Latvian' },
      { text: 'Wallisian', value: 'Wallisian' },
      { value: '', text: 'Choose nationality', selected: true }
    ]
    const nationalities = getNationalityTextAndValues()

    expect(nationalities).toHaveLength(226)
    expect(nationalities).toEqual(expect.arrayContaining(expectedToInclude))
  })
})
