describe('getLpaNames', () => {
  let LPAModule
  const jsonFilePath = 'packages/webapp/src/utils/__tests__/test-data/lpas-test-data.json'

  beforeEach(() => {
    return import('../get-lpas.js').then(module => {
      LPAModule = module
      jest.resetModules()
    })
  })

  it('Should extract all lpa names from lpa file', () => {
    const expected = ['Secretary of State', 'County Durham LPA']
    const lpaNames = LPAModule.getLpaNames(jsonFilePath)

    expect(lpaNames).toHaveLength(2)
    expect(lpaNames).toEqual(expect.arrayContaining(expected))
  })

  it('Should extract all lpa names and codes from lpa file', () => {
    const expected = [
      { name: 'Secretary of State', id: '' },
      { name: 'County Durham LPA', id: 'E60000001' }
    ]
    const lpaNamesAndCodes = LPAModule.getLpaNamesAndCodes(jsonFilePath)

    expect(lpaNamesAndCodes).toHaveLength(2)
    expect(lpaNamesAndCodes).toEqual(expect.arrayContaining(expected))
  })

  it('Should throw error when file does not exist', () => {
    expect(() => {
      LPAModule.getLpaNames()
    }).toThrow('Error processing LPA file - ')
  })
})
