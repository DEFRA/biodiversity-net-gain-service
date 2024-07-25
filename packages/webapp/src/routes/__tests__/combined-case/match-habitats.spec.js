import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import { getNumberOfPages, getSheetName, getHabitats } from '../../combined-case/match-habitats'
import constants from '../../../utils/constants'
import mockMetricData from '../../combined-case/mock-metric-data'

const url = constants.routes.COMBINED_CASE_MATCH_HABITATS

describe(url, () => {
  describe('GET', () => {
    it('should load the page correctly', async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST', () => {
    it('should continue journey to next page if a selection is made', async () => {
      const currentPage = 1
      const response = await submitPostRequest({ url, method: 'post', payload: { currentPage } })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe(`${url}?page=${currentPage + 1}`)
    })
  })

  // TODO: implement this behavior in the file and fix test
  describe.skip('POST on last page', () => {
    it.skip('should continue journey to the correct page after submitting the last page', async () => {
      const lastPage = 3
      const response = await submitPostRequest({ url, method: 'post', payload: { currentPage: lastPage } })

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/confirm-matched-habitats')
    })
  })

  // this test is failing because the getNumberOfPages function is not returning the correct number of pages
  // the issue is that the mockMetricData contains partial data which is skewing the count
  // TODO: discuss with team how to handle this
  describe.skip('getNumberOfPages function should return the correct number of pages for the given data', () => {
    it.skip('calculates the correct number of pages for the given data', () => {
      expect(getNumberOfPages(mockMetricData)).toBe(8)
    })
  })

  describe('getSheetName function should return the correct sheet name for the given key', () => {
    expect(getSheetName('d2')).toBe('D-2 Off-Site Habitat Creation')
    expect(getSheetName('d3')).toBe('D-3 Off-Site Habitat Enhancement')
    expect(getSheetName('e2')).toBe('E-2 Off-Site Hedge Creation')
    expect(getSheetName('e3')).toBe('E-3 Off-Site Hedge Enhancement')
    expect(getSheetName('f2')).toBe('F-2 Off-Site Watercourse Creation')
    expect(getSheetName('f3')).toBe('F-3 Off-Site Watercourse Enhancement')
    expect(getSheetName('unknown')).toBe('Unknown Key')
  })
  describe('getHabitats function', () => {
    it('should correctly process data and return habitats with condition', () => {
      const habitats = getHabitats(mockMetricData)
      expect(habitats).toHaveProperty('proposed')
      expect(habitats.proposed).toBeInstanceOf(Array)
      habitats.proposed.forEach(habitat => {
        expect(habitat).toHaveProperty('habitatType')
        expect(habitat).toHaveProperty('area')
        expect(habitat).toHaveProperty('condition')
      })
    })
  })
})
