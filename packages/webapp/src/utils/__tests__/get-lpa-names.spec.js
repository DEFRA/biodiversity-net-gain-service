import getLpaNames from '../get-lpa-names.js'

describe('getLpaNames', () => {
  it('Should extract all lpa names from lpa file', async () => {
    const lpaNames = await getLpaNames('packages/webapp/src/utils/__tests__/test-data/lpas-test-data.json')

    expect(lpaNames.length).toEqual(2)
  })

  it('Should throw error when file does not exist', async () => {
    try {
      await getLpaNames('packages/webapp/src/utils/__tests__/test-data/lpas-test-data1.json')
    } catch (err) {
      expect(err).toEqual(new Error('Error processing LPA file - '))
    }
  })
})
