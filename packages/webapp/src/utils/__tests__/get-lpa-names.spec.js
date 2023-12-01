import { getLpaNames, getLpaNamesAndCodes } from '../get-lpas.js'

describe('getLpaNames', () => {
  it('Should extract all lpa names from lpa file', () => {
    const expectedToInclude = ['Secretary of State', 'County Durham LPA']
    const lpaNames = getLpaNames()

    expect(lpaNames).toHaveLength(334)
    expect(lpaNames).toEqual(expect.arrayContaining(expectedToInclude))
  })

  it('Should extract all lpa names and codes from lpa file', () => {
    const expectedToInclude = [
      { name: 'Secretary of State', id: '' },
      { name: 'County Durham LPA', id: 'E60000001' }
    ]
    const lpaNamesAndCodes = getLpaNamesAndCodes()

    expect(lpaNamesAndCodes).toHaveLength(334)
    expect(lpaNamesAndCodes).toEqual(expect.arrayContaining(expectedToInclude))
  })
})
