import processTrustedFile from '../index.mjs'
import { getContext } from '../../.jest/setup.js'
import { Readable } from 'stream'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import fs from 'fs'
jest.mock('@defra/bng-connectors-lib')

const METRIC_FILE_EXTENSION = '.xlsx'
const DEVELOPER_METRIC_UPLOAD_TYPE = 'developer-metric-upload'
const CREDITS_PURCHASE_METRIC_UPLOAD_TYPE = 'credits-metric-upload'
const LOJ_METRIC_UPLOAD_TYPE = 'metric-upload'
const REPROJECTED_TO_OSGB36 = 'reprojectedToOsgb36'

describe('Trusted file processing', () => {
  it('should process a known metric file.', done => {
    performValidMetricFileProcessingTest(METRIC_FILE_EXTENSION, done)
  })

  it('should process a known developer metric file. ', done => {
    performDeveloperValidMetricFileProcessingTest(METRIC_FILE_EXTENSION, done)
  })

  it('should process a known credits metric file. ', done => {
    performCreditsValidMetricFileProcessingTest(METRIC_FILE_EXTENSION, done)
  })

  it('should not process an unsupported file type.', done => {
    jest.isolateModules(async () => {
      try {
        const filename = 'mock-data.json'
        const userId = 'mockSessionId'
        const uploadType = 'unknown-upload-type'
        const expectedRes = {
          status: 400,
          body: {
            code: 'UNKNOWN-UPLOAD-TYPE',
            uploadType
          }
        }
        const req = {
          body: {
            uploadType,
            location: `${userId}/mockUploadType/${filename}`
          }
        }

        await processTrustedFile(getContext(), req)
        expect(getContext().res.status).toEqual(400)
        expect(getContext().res.body).toStrictEqual(expectedRes.body)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('Should process a trusted LOJ metric file', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()
        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
          const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
          const readableStream = Readable.from(readStream)
          return {
            readableStreamBody: readableStream
          }
        })
        await processTrustedFile(context, {
          body: {
            uploadType: LOJ_METRIC_UPLOAD_TYPE,
            location: 'test',
            containerName: 'test'
          }
        })
        expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toBeDefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should process a trusted developer metric file', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()
        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
          const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
          const readableStream = Readable.from(readStream)
          return {
            readableStreamBody: readableStream
          }
        })
        await processTrustedFile(context, {
          body: {
            uploadType: DEVELOPER_METRIC_UPLOAD_TYPE,
            location: 'test',
            containerName: 'test'
          }
        })

        expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toBeDefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })

  it('Should process a trusted credits metric file', done => {
    jest.isolateModules(async () => {
      try {
        const context = getContext()
        blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
          const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
          const readableStream = Readable.from(readStream)
          return {
            readableStreamBody: readableStream
          }
        })
        await processTrustedFile(context, {
          body: {
            uploadType: CREDITS_PURCHASE_METRIC_UPLOAD_TYPE,
            location: 'test',
            containerName: 'test'
          }
        })

        expect(blobStorageConnector.downloadStreamIfExists).toHaveBeenCalled()
        expect(context.res.status).toEqual(200)
        expect(context.res.body).toBeDefined()
        done()
      } catch (err) {
        done(err)
      }
    })
  })
})

const buildConfig = (fileExtension, uploadType, epsg) => {
  const userId = 'mock-session-id'
  const filenameRoot = 'mock-data'
  const fileDirectory = `${userId}/mockUploadType`
  const filename = `${filenameRoot}${fileExtension}`
  const outputFileLocation = uploadType.indexOf('.') > 0 ? `${fileDirectory}/${filenameRoot}` : `${fileDirectory}/${filenameRoot}.geojson`
  const reprojectedFileDirectory = `${fileDirectory}/${REPROJECTED_TO_OSGB36}`
  const reprojectedOutputFileLocation = uploadType.indexOf('.') > 0 ? `${reprojectedFileDirectory}/${filenameRoot}` : `${reprojectedFileDirectory}/${filenameRoot}.geojson`
  const reprojectedOutputFileSize = 500
  const mapConfig = {
    centroid: 'mock centroid',
    epsg: epsg || 'mock EPSG',
    extent: ['mock extent']
  }

  const metricData = {
    startPage: {
      projectName: 'mock project',
      projectAuthority: 'mock authority'
    }
  }

  const config = {
    req: {
      body: {
        uploadType,
        blobName: `${fileDirectory}/${filename}`,
        containerName: 'customer-uploads'
      }
    },
    expectedRes: {
      status: 200,
      body: {
        location: outputFileLocation,
        mapConfig
      }
    }
  }

  if (epsg !== '27700') {
    config.expectedRes.body.reprojectedLocation = reprojectedOutputFileLocation
    config.expectedRes.body.reprojectedFileSize = reprojectedOutputFileSize
  }

  switch (uploadType) {
    case DEVELOPER_METRIC_UPLOAD_TYPE:
    case CREDITS_PURCHASE_METRIC_UPLOAD_TYPE:
      config.metricData = metricData
      break

    default:
      config.mapConfig = mapConfig
      break
  }

  return config
}

const performValidMetricFileProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, 'metric-upload')
      blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
        const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
        const readableStream = Readable.from(readStream)
        return {
          readableStreamBody: readableStream
        }
      })
      await processTrustedFile(getContext(), testConfig.req)

      expect(getContext().res.status).toEqual(200)
      expect(JSON.parse(getContext().res.body)).toBeDefined()
      done()
    } catch (e) {
      done(e)
    }
  })
}

const performDeveloperValidMetricFileProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, DEVELOPER_METRIC_UPLOAD_TYPE)
      blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
        const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
        const readableStream = Readable.from(readStream)
        return {
          readableStreamBody: readableStream
        }
      })
      await processTrustedFile(getContext(), testConfig.req)

      expect(getContext().res.status).toEqual(200)
      expect(JSON.parse(getContext().res.body)).toBeDefined()
      done()
    } catch (e) {
      done(e)
    }
  })
}

const performCreditsValidMetricFileProcessingTest = (fileExtension, done) => {
  jest.isolateModules(async () => {
    try {
      const testConfig = buildConfig(fileExtension, CREDITS_PURCHASE_METRIC_UPLOAD_TYPE)
      blobStorageConnector.downloadStreamIfExists = jest.fn().mockImplementation(async () => {
        const readStream = fs.createReadStream('packages/azure-functions/ProcessTrustedFile/__mock-data__/metric-file/metric-4.0.2.xlsm')
        const readableStream = Readable.from(readStream)
        return {
          readableStreamBody: readableStream
        }
      })
      await processTrustedFile(getContext(), testConfig.req)

      expect(getContext().res.status).toEqual(200)
      expect(JSON.parse(getContext().res.body)).toBeDefined()
      done()
    } catch (e) {
      done(e)
    }
  })
}
