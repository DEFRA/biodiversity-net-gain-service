import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import { getSheetName } from '../../combined-case/match-habitats'
import constants from '../../../utils/constants'
import mockMetricData from '../../combined-case/mock-metric-data'

const url = constants.routes.COMBINED_CASE_MATCH_HABITATS

describe(url, () => {
  describe('GET', () => {
    it('should load the page correctly', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.DEVELOPER_METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING] = sessionData[constants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS] = sessionData[constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS] = [{
        habitatType: 'Wetland',
        condition: 'Poor',
        module: 'Created',
        state: 'Hedge',
        id: '0',
        size: 15,
        measurementUnits: 'hectares',
        processed: false
      }]
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.statusCode).toBe(200)
    })

    it('should load the page correctly with a checked radio', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.DEVELOPER_METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING] = sessionData[constants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS] = sessionData[constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS] = [{
        habitatType: 'Wetland',
        condition: 'Poor',
        module: 'Created',
        state: 'Hedge',
        id: '0',
        size: 15,
        measurementUnits: 'hectares',
        processed: false,
        matchedHabitatId: '0'
      }]
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('value="0" checked')
    })

    it('should load the page correctly and process metric data when no allocation habitats', async () => {
      const sessionData = {}
      sessionData[constants.redisKeys.METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.DEVELOPER_METRIC_DATA] = mockMetricData
      const response = await submitGetRequest({ url }, 200, sessionData)
      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST', () => {
    it('should take user page to form of current page if no selection is made', async () => {
      const currentPage = 1
      const matchHabitats = null
      const sessionData = {}
      sessionData[constants.redisKeys.METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.DEVELOPER_METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.COMBINED_CASE_SELECTED_HABITAT_ID] = 1
      sessionData[constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING] = [
        {
          id: 1
        },
        {
          id: 2,
          processed: false
        }
      ]

      const response = await submitPostRequest({ url, method: 'post', payload: { currentPage, matchHabitats } }, 302, sessionData)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe(`${url}?page=${currentPage}`)
    })

    it('should continue journey to next page if a selection is made', async () => {
      const currentPage = 1
      const matchHabitats = { foo: 'bar' }
      const sessionData = {}
      sessionData[constants.redisKeys.METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.DEVELOPER_METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.COMBINED_CASE_SELECTED_HABITAT_ID] = 1
      sessionData[constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING] = [
        {
          id: 1
        },
        {
          id: 2,
          processed: false
        }
      ]

      const response = await submitPostRequest({ url, method: 'post', payload: { currentPage, matchHabitats } }, 302, sessionData)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe(`${url}?page=${currentPage + 1}`)
    })

    it('should complete if no next page', async () => {
      const currentPage = 1
      const matchHabitats = { foo: 'bar' }
      const sessionData = {}
      sessionData[constants.redisKeys.METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.DEVELOPER_METRIC_DATA] = mockMetricData
      sessionData[constants.redisKeys.COMBINED_CASE_SELECTED_HABITAT_ID] = 1
      sessionData[constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING] = [
        {
          id: 1
        },
        {
          id: 2,
          processed: true
        }
      ]

      const response = await submitPostRequest({ url, method: 'post', payload: { currentPage, matchHabitats } }, 302, sessionData)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe(constants.routes.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY)
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
})
